import prisma from "./prisma.js";

/**
 * Lock funds from a user's wallet balance into their locked balance.
 * @param {string} userEmail - The email of the user.
 * @param {number} amount - The amount to lock.
 * @returns {Promise<{success: boolean, message: string, error?: string}>}
 */
export const lockFunds = async (userEmail, amount) => {
    try {
        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { email: userEmail },
            });

            if (!user) {
                throw new Error("User not found");
            }

            if (user.walletBalance < amount) {
                throw new Error("Insufficient wallet balance");
            }

            const updatedUser = await tx.user.update({
                where: { email: userEmail },
                data: {
                    walletBalance: { decrement: amount },
                    lockedBalance: { increment: amount },
                },
            });

            return { success: true, message: `Locked ${amount} USDC`, data: updatedUser };
        });
    } catch (error) {
        console.error("Lock funds error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Release locked funds and distribute them between the teacher and the student's remaining balance.
 * @param {string} userEmail - The email of the user.
 * @param {string} teacherEmail - The email of the teacher.
 * @param {number} amountLocked - The total amount that was locked.
 * @param {number} actualCost - The actual cost of the session.
 * @returns {Promise<{success: boolean, message: string, error?: string}>}
 */
export const releaseAndDistributeFunds = async (userEmail, teacherEmail, amountLocked, actualCost) => {
    try {
        const refundAmount = amountLocked - actualCost;

        if (refundAmount < 0) {
            console.warn(`Warning: Actual cost (${actualCost}) exceeds locked amount (${amountLocked}). Charging full locked amount.`);
        }

        const finalCost = Math.min(actualCost, amountLocked);
        const finalRefund = Math.max(0, amountLocked - finalCost);

        return await prisma.$transaction(async (tx) => {
            // Update User: decrement lockedBalance, increment walletBalance with refund
            await tx.user.update({
                where: { email: userEmail },
                data: {
                    lockedBalance: { decrement: amountLocked },
                    walletBalance: { increment: finalRefund },
                },
            });

            // Update Teacher: increment walletBalance with cost
            await tx.teacher.update({
                where: { email: teacherEmail },
                data: {
                    walletBalance: { increment: finalCost },
                },
            });

            return {
                success: true,
                message: `Distributed ${finalCost} to teacher and refunded ${finalRefund} to user`,
                data: { cost: finalCost, refund: finalRefund }
            };
        });
    } catch (error) {
        console.error("Release and distribute funds error:", error);
        return { success: false, message: error.message };
    }
};

import prisma from "../utils/prisma.js";
import { createPaymentIntent, createMilestone, completeMilestone, cancelPaymentIntent, getEscrow } from "../utils/finternet.service.js";

/**
 * Start a new lecture viewing session
 * Creates payment intent, milestone, and locks estimated funds
 */
export const startLectureSession = async (req, res) => {
    const { lectureId } = req.body;
    const userEmail = req.user.email;

    try {
        // Get lecture details
        const lecture = await prisma.lecture.findUnique({
            where: { id: lectureId },
            include: { course: true },
        });

        if (!lecture) {
            return res.sendResponse(404, false, "Lecture not found");
        }

        // Check if user already has an active session for this lecture
        const existingSession = await prisma.viewingSession.findFirst({
            where: {
                userEmail,
                lectureId,
                status: { in: ["ACTIVE", "PAUSED"] },
            },
        });

        if (existingSession) {
            return res.sendResponse(400, false, "You already have an active session for this lecture");
        }

        // Calculate lock amount
        // max(2 * avgViewingTime * pricePerMinute, duration * pricePerMinute)
        const avgViewingMinutes = (lecture.avgViewingTime || lecture.duration) / 60;
        const durationMinutes = lecture.duration / 60;
        const estimatedAmount1 = 2 * avgViewingMinutes * lecture.pricePerMinute;
        const estimatedAmount2 = durationMinutes * lecture.pricePerMinute;
        const lockAmount = Math.max(estimatedAmount1, estimatedAmount2);

        // Create payment intent
        const paymentIntent = await createPaymentIntent(lockAmount, {
            userEmail,
            lectureId,
            lectureTitle: lecture.title,
            courseTitle: lecture.course.title,
            description: `Viewing session for ${lecture.title}`,
        });

        if (!paymentIntent.success) {
            return res.sendResponse(500, false, "Failed to create payment intent", {
                error: paymentIntent.error,
            });
        }

        const paymentIntentId = paymentIntent.data?.data?.id;
        if (!paymentIntentId) {
            return res.sendResponse(500, false, "Invalid payment intent response");
        }

        // DEBUG: Check if escrow is created immediately
        const escrowCheck = await getEscrow(paymentIntentId);
        console.log("Immediate Escrow Check:", escrowCheck.success ? "Found" : "Not Found", escrowCheck.data || escrowCheck.error);


        // Milestone will be created at the end of session for the exact amount
        const milestoneId = null;

        // Create viewing session
        const session = await prisma.viewingSession.create({
            data: {
                userEmail,
                lectureId,
                paymentIntentId,
                status: "ACTIVE",
                currentTimestamp: new Date(),
            },
        });

        // Create payment record
        await prisma.payment.create({
            data: {
                sessionId: session.id,
                paymentIntentId,
                milestoneId,
                amountLocked: lockAmount,
                status: "LOCKED",
                currency: "USDC",
            },
        });

        return res.sendResponse(200, true, "Session started successfully", {
            sessionId: session.id,
            lockAmount,
            paymentIntentId,
            milestoneId,
        });
    } catch (error) {
        console.error("Start session error:", error);
        return res.sendResponse(500, false, "Failed to start session", {
            error: error.message,
        });
    }
};

/**
 * Pause a viewing session
 * Updates total watch time
 */
export const pauseSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        if (session.status !== "ACTIVE") {
            return res.sendResponse(400, false, "Session is not active");
        }

        // Calculate elapsed time
        const now = new Date();
        const elapsedSeconds = Math.floor((now - session.currentTimestamp) / 1000);

        // Update session
        const updatedSession = await prisma.viewingSession.update({
            where: { id: sessionId },
            data: {
                totalWatchTime: session.totalWatchTime + elapsedSeconds,
                status: "PAUSED",
            },
        });

        return res.sendResponse(200, true, "Session paused successfully", {
            sessionId: updatedSession.id,
            totalWatchTime: updatedSession.totalWatchTime,
        });
    } catch (error) {
        console.error("Pause session error:", error);
        return res.sendResponse(500, false, "Failed to pause session", {
            error: error.message,
        });
    }
};

/**
 * Resume a paused viewing session
 * Resets current timestamp
 */
export const resumeSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        if (session.status !== "PAUSED") {
            return res.sendResponse(400, false, "Session is not paused");
        }

        // Update session
        const updatedSession = await prisma.viewingSession.update({
            where: { id: sessionId },
            data: {
                currentTimestamp: new Date(),
                status: "ACTIVE",
            },
        });

        return res.sendResponse(200, true, "Session resumed successfully", {
            sessionId: updatedSession.id,
        });
    } catch (error) {
        console.error("Resume session error:", error);
        return res.sendResponse(500, false, "Failed to resume session", {
            error: error.message,
        });
    }
};

/**
 * End a viewing session
 * Calculates final watch time, completes milestone, and updates lecture analytics
 */
export const endSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
            include: {
                lecture: true,
                payment: true,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        if (session.status === "ENDED") {
            return res.sendResponse(400, false, "Session already ended");
        }

        // Calculate final watch time
        let finalWatchTime = session.totalWatchTime;
        if (session.status === "ACTIVE") {
            const now = new Date();
            const elapsedSeconds = Math.floor((now - session.currentTimestamp) / 1000);
            finalWatchTime += elapsedSeconds;
        }

        // Calculate charge (convert seconds to minutes)
        const watchMinutes = finalWatchTime / 60;
        const chargeAmount = watchMinutes * session.lecture.pricePerMinute;

        // Create milestone for the actual charge amount
        const milestone = await createMilestone(
            session.paymentIntentId,
            chargeAmount,
            `Lecture viewing - ${session.lecture.title}`,
            0 // Index 0 as it's the first/only milestone for this session
        );

        if (!milestone.success) {
            return res.sendResponse(500, false, "Failed to create milestone", {
                error: milestone.error,
            });
        }

        const milestoneId = milestone.data?.data?.id;

        // Complete the newly created milestone
        const paymentResult = await completeMilestone(
            session.paymentIntentId,
            milestoneId,
            userEmail,
            `Watched ${finalWatchTime}s, charged ${chargeAmount.toFixed(2)} USDC`
        );

        if (!paymentResult.success) {
            return res.sendResponse(500, false, "Failed to complete milestone", {
                error: paymentResult.error,
            });
        }

        // Update session
        await prisma.viewingSession.update({
            where: { id: sessionId },
            data: {
                totalWatchTime: finalWatchTime,
                status: "ENDED",
            },
        });

        // Update payment record
        await prisma.payment.update({
            where: { sessionId },
            data: {
                amountCharged: chargeAmount,
                status: "COMPLETED",
            },
        });

        // Create lecture access record
        await prisma.lectureAccess.create({
            data: {
                userEmail,
                lectureId: session.lectureId,
            },
        });

        // Update lecture's average viewing time
        const allSessions = await prisma.viewingSession.findMany({
            where: {
                lectureId: session.lectureId,
                status: "ENDED",
            },
        });

        const totalViewingTime = allSessions.reduce((sum, s) => sum + s.totalWatchTime, 0);
        const avgViewingTime = Math.floor(totalViewingTime / allSessions.length);

        await prisma.lecture.update({
            where: { id: session.lectureId },
            data: { avgViewingTime },
        });

        return res.sendResponse(200, true, "Session ended successfully", {
            sessionId,
            finalWatchTime,
            chargeAmount,
            watchMinutes: watchMinutes.toFixed(2),
        });
    } catch (error) {
        console.error("End session error:", error);
        return res.sendResponse(500, false, "Failed to end session", {
            error: error.message,
        });
    }
};

/**
 * Get session details
 */
export const getSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
            include: {
                lecture: true,
                payment: true,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        return res.sendResponse(200, true, "Session retrieved successfully", session);
    } catch (error) {
        console.error("Get session error:", error);
        return res.sendResponse(500, false, "Failed to get session", {
            error: error.message,
        });
    }
};

/**
 * Get session escrow details
 */
export const getSessionEscrowDetails = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        const escrowResult = await getEscrow(session.paymentIntentId);

        if (!escrowResult.success) {
            return res.sendResponse(500, false, "Failed to get escrow details", {
                error: escrowResult.error,
            });
        }

        return res.sendResponse(200, true, "Escrow details retrieved successfully", escrowResult.data);
    } catch (error) {
        console.error("Get session escrow error:", error);
        return res.sendResponse(500, false, "Failed to get session escrow details", {
            error: error.message,
        });
    }
};


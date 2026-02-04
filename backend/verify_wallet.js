import prisma from "./utils/prisma.js";
import { lockFunds, releaseAndDistributeFunds } from "./utils/wallet.service.js";

async function verifyWalletSystem() {
    const studentEmail = "student@test.com";
    const teacherEmail = "teacher@test.com";
    const lockAmount = 100.0;
    const actualCost = 65.5;

    console.log("--- Starting Wallet System Verification ---");

    try {
        // 1. Setup Test Data
        console.log("1. Setting up test user and teacher...");
        await prisma.user.upsert({
            where: { email: studentEmail },
            update: { walletBalance: 200.0, lockedBalance: 0.0 },
            create: { email: studentEmail, username: "Test Student", password: "password", walletBalance: 200.0, lockedBalance: 0.0 }
        });

        await prisma.teacher.upsert({
            where: { email: teacherEmail },
            update: { walletBalance: 0.0 },
            create: { email: teacherEmail, username: "Test Teacher", password: "password", walletBalance: 0.0 }
        });

        // 2. Test Locking Funds
        console.log(`2. Locking ${lockAmount} USDC from student's wallet...`);
        const lockRes = await lockFunds(studentEmail, lockAmount);
        console.log("Lock Result:", lockRes.success ? "SUCCESS" : "FAILED", lockRes.message);

        let student = await prisma.user.findUnique({ where: { email: studentEmail } });
        console.log(`   Student Balance: ${student.walletBalance}, Locked: ${student.lockedBalance}`);

        if (student.walletBalance !== 100.0 || student.lockedBalance !== 100.0) {
            throw new Error("Lock logic failed!");
        }

        // 3. Test Releasing and Distributing Funds
        console.log(`3. Releasing funds (Cost: ${actualCost}, Refund: ${lockAmount - actualCost})...`);
        const distRes = await releaseAndDistributeFunds(studentEmail, teacherEmail, lockAmount, actualCost);
        console.log("Distribution Result:", distRes.success ? "SUCCESS" : "FAILED", distRes.message);

        student = await prisma.user.findUnique({ where: { email: studentEmail } });
        const teacher = await prisma.teacher.findUnique({ where: { email: teacherEmail } });

        console.log(`   Student Balance: ${student.walletBalance}, Locked: ${student.lockedBalance}`);
        console.log(`   Teacher Balance: ${teacher.walletBalance}`);

        if (student.walletBalance !== 134.5 || student.lockedBalance !== 0.0 || teacher.walletBalance !== 65.5) {
            throw new Error("Distribution logic failed!");
        }

        console.log("\n--- Verification Completed Successfully! ---");
    } catch (error) {
        console.error("\n--- Verification Failed! ---");
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

verifyWalletSystem();

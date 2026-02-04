import axios from "axios";

const FINTERNET_API_URL = "https://api.fmm.finternetlab.io/api/v1";
const FINTERNET_API_KEY = process.env.FINTERNET_API_KEY || "sk_test_your_key";
const SETTLEMENT_DESTINATION = process.env.SETTLEMENT_DESTINATION || "bank_account_123";

/**
 * Create a payment intent to lock funds in escrow
 */
export const createPaymentIntent = async (amount, metadata = {}) => {
    try {
        const url = `${FINTERNET_API_URL}/payment-intents`;

        const response = await axios.post(
            url,
            {
                amount: String(amount.toFixed(2)),
                currency: "USD",
                type: "DELIVERY_VS_PAYMENT",
                settlementMethod: "OFF_RAMP_MOCK",
                settlementDestination: "bank_account_123",
                metadata: {
                    releaseType: "MILESTONE_LOCKED",
                    ...metadata,
                },
            },
            {
                headers: {
                    "X-API-Key": FINTERNET_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Payment intent created:", response.data?.data?.id || response.data?.id);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Finternet createPaymentIntent error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Get escrow details for a payment intent
 */
export const getEscrow = async (paymentIntentId) => {
    try {
        const url = `${FINTERNET_API_URL}/payment-intents/${paymentIntentId}/escrow`;

        const response = await axios.get(url, {
            headers: {
                "X-API-Key": FINTERNET_API_KEY,
                "Content-Type": "application/json",
            },
        });

        console.log("Escrow details retrieved:", paymentIntentId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Finternet getEscrow error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Create a milestone for a payment intent
 */
export const createMilestone = async (paymentIntentId, amount, description, index = 0) => {
    try {
        const url = `${FINTERNET_API_URL}/payment-intents/${paymentIntentId}/escrow/milestones`;

        const response = await axios.post(
            url,
            {
                milestoneIndex: index,
                amount: amount.toFixed(2),
                description,
            },
            {
                headers: {
                    "X-API-Key": FINTERNET_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Milestone created:", response.data?.data?.id || response.data?.id);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Finternet createMilestone error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Complete a milestone to release funds
 */
export const completeMilestone = async (paymentIntentId, milestoneId, completedBy = "system", completionProof = "") => {
    try {
        const url = `${FINTERNET_API_URL}/payment-intents/${paymentIntentId}/escrow/milestones/${milestoneId}/complete`;

        const response = await axios.post(
            url,
            {
                completedBy,
                completionProof,
            },
            {
                headers: {
                    "X-API-Key": FINTERNET_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Milestone completed:", milestoneId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Finternet completeMilestone error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Cancel payment intent and release all locked funds
 */
export const cancelPaymentIntent = async (paymentIntentId) => {
    try {
        const url = `${FINTERNET_API_URL}/payment-intents/${paymentIntentId}/cancel`;

        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    "X-API-Key": FINTERNET_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Payment intent cancelled:", paymentIntentId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Finternet cancelPaymentIntent error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Submit delivery proof for DVP
 */
export const submitDeliveryProof = async (paymentIntentId, proofHash, proofURI, submittedBy) => {
    try {
        const url = `${FINTERNET_API_URL}/payment-intents/${paymentIntentId}/escrow/delivery-proof`;

        const response = await axios.post(
            url,
            {
                proofHash,
                proofURI,
                submittedBy,
            },
            {
                headers: {
                    "X-API-Key": FINTERNET_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Delivery proof submitted for:", paymentIntentId);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Finternet submitDeliveryProof error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

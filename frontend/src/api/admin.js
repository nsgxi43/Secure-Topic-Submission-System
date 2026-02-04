import client from './client';

export const adminService = {
    getAuditLogs: async () => {
        // Expected endpoint: GET /admin/audit
        const response = await client.get('/admin/audit');
        return response.data;
    },

    finalizeSystem: async () => {
        // Expected endpoint: GET /admin/finalize 
        // (Note: usually POST for actions, but user spec says GET)
        const response = await client.get('/admin/finalize');
        return response.data;
    },

    verifyOtp: async (otp) => {
        const response = await client.post('/admin/verify-otp', { otp });
        return response.data;
    }
};

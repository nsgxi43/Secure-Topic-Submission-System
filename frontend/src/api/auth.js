import client from './client';

export const authService = {
    login: async (username, password) => {
        const response = await client.post('/login', { username, password });
        return response.data;
    },

    register: async (username, password, role) => {
        const response = await client.post('/register', { username, password, role });
        return response.data;
    },

    verifyOtp: async (otp) => {
        const response = await client.post('/admin/verify-otp', { otp });
        return response.data;
    },

    sendStudentOtp: async (email, password) => {
        const response = await client.post('/student/request-otp', { email, password });
        return response.data;
    },

    verifyStudentOtp: async (email, otp) => {
        const response = await client.post('/student/verify-otp', { email, otp });
        return response.data;
    },

    getCurrentUser: async () => {
        // There isn't an explicit "get current user" endpoint in the description, 
        // but usually session based auth simply works. 
        // We might need to rely on the side effects of successful login or check a protected route.
        // For now, we will handle state in the frontend context after login.
        // Ideally, a /me endpoint exists. If not, we trust the session until it fails.
        return true;
    }
};

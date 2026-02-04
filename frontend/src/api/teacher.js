import client from './client';

export const teacherService = {
    getTopics: async () => {
        // Expected endpoint: GET /teacher/topics
        const response = await client.get('/teacher/topics');
        return response.data;
    },

    downloadExport: async () => {
        const response = await client.get('/teacher/export', { responseType: 'blob' });
        return response.data;
    }
};

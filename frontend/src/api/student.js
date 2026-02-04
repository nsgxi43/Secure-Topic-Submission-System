import client from './client';

export const studentService = {
    submitTopic: async (topic_name, topic_description) => {
        // Expected endpoint: POST /student/submit
        // Backend only accepts 'topic' field. We combine them.
        const full_topic = `${topic_name} - ${topic_description}`;
        const response = await client.post('/student/submit', { topic: full_topic });
        return response.data;
    },

    getReceipt: async (receiptId) => {
        const response = await client.get(`/receipt/${receiptId}`);
        return response.data;
    }
};

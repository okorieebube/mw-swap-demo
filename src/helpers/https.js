import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

export const Request = {
    post: async (url, data) => {
        // console.log({url, data})
        return await axios.post(`${url}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                return { error_status: 0, data: response };
            })
            .catch((error) => {
                return { error_status: 1, data: error };
            });
    },

    get: async (url, config) => {
        const headers = config?.headers;
        console.log(url);
        return await axios.get(url, {
            ...config,
            headers: {
                ...headers,
                // "Access-Control-Allow-Origin": process.env.REACT_APP_APP_URL,
            },
        });
    },
};

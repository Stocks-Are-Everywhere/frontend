import axios from "axios";

const API_URL = `${process.env.REACT_APP_USER_API_URL}/api`;

const ApiService = {
    getSavedStocks: async (): Promise<string[]> => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            console.warn("JWT token is missing. Redirecting to auth page...");
            window.location.href = `${process.env.REACT_APP_CLIENT_URL}/auth`
            return [];
        }

        try {
            const response = await axios.get(`${API_URL}/members/base/stock`, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            // Extract only the `tickerCode` values from the response
            return response.data.map((stock: { tickerCode: string }) => stock.tickerCode);
        } catch (error: any) {
            console.error("Error fetching saved stocks:", error);

            if (error.response?.status === 401) {
                console.warn("Unauthorized request. Redirecting to auth page...");
                window.location.href = `${process.env.REACT_APP_CLIENT_URL}/auth`
            }

            return []; // Return empty array on error to avoid crashes
        }
    },
};

export default ApiService;

import axios from "axios";

export const getTodayDistributionChart = async (time: string, companyCode: string) => {
    const res = axios.get(`/api/v1/charts`, {
        params: {
            "companyCode": companyCode,
            "time": time
        }
    })
    .then((res) => {
        return res.data;
    })
    .catch((err) => console.log(err.response)); 
    return res; 
};
import axios from "axios";

export const getTodayDistributionChart = async (time: string, companyCode: string) => {
    const res = axios.get(`/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice?fid_cond_mrkt_div_code=J&fid_input_iscd=005930`, {
        headers: {
            "content-type": "application/json",
            "authorization": process.env.REACT_APP_AUTHORIZATION,
            "appkey": process.env.REACT_APP_KEY,
            "appsecret": process.env.REACT_APP_SECRET,
            "tr_id":"FHKST03010200"
        }, params: {
            "FID_ETC_CLS_CODE": "",
            "FID_COND_MRKT_DIV_CODE": "J",
            "FID_INPUT_ISCD": companyCode,
            "FID_INPUT_HOUR_1": "092800",
            "FID_PW_DATA_INCU_YN": "Y"
        }
    })
    .then((res) => {
        return res.data;
    })
    .catch((err) => console.log(err.response)); 
    return res; 
};
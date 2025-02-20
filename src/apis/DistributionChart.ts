/* eslint-disable @typescript-eslint/no-unused-vars */

export default interface Distribution {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export default interface DistributionResFromApi {
    stck_bsop_date: string; // 날짜
    stck_cntg_hour: string; // 시간
    stck_oprc: string; // 시가 (Open)
    stck_hgpr: string; // 고가 (High)
    stck_lwpr: string; // 저가 (Low)
    stck_prpr: string; // 종가 (Close)
    cntg_vol: string; // 거래량 (Volume)
}

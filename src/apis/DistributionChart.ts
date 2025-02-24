/* eslint-disable @typescript-eslint/no-unused-vars */

export interface Distribution {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface DistributionResFromApi {
    stck_bsop_date: string;
    stck_cntg_hour: string;
    stck_oprc: string;
    stck_hgpr: string;
    stck_lwpr: string;
    stck_prpr: string;
    cntg_vol: string;
}
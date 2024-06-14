import {TransferType} from "../types/Types";

export interface Transfer {
    readonly from_stop_id: string;
    readonly to_stop_id: string;
    readonly transfer_type: TransferType;
    readonly min_transfer_time?: number;

}

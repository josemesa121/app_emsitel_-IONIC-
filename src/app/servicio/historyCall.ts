export interface CallHistory {
    call_history: CallHistoryElement[];
}

export interface CallHistoryElement {
    created_at: Date;
    destination: string;
    sale: number;
    duration: number;
}
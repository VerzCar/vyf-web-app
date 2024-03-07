export interface CircleCreateRawForm {
    name: string;
    description: string | null;
    validFrom: Date | null;
    validUntil: Date | null;
    private: boolean;
    voters: string[];
    candidates: string[];
}

export interface CircleCreateRawForm {
    name: string;
    description: string | null;
    validUntil: Date | null;
    private: boolean;
    voters: string[];
}

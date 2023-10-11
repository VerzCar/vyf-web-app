export interface CircleCreateRawForm {
    name: string;
    description: string | null;
    imgSrc: string | null;
    validUntil: Date | null;
    private: boolean;
    voters: string[];
}

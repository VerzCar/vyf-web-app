export interface Circle {
    id: number;
    name: string;
    description: string;
    imageSrc: string;
    private: boolean;
    active: boolean;
    createdFrom: string;
    validFrom: Date | null;
    validUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Circle {
    id: number;
    name: string;
    description: string;
    imageSrc: string;
    private: boolean;
    active: boolean;
    createdFrom: string;
    validUntil: Date;
    createdAt: Date;
    updatedAt: Date;
}

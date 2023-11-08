export interface CirclePaginated {
    id: number;
    name: string;
    description: string;
    imageSrc: string;
    votersCount: number | null;
    active: boolean;
}

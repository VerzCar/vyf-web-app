export interface CirclePaginated {
    id: number;
    name: string;
    description: string;
    imageSrc: string;
    votersCount: number | null;
    candidatesCount: number | null;
    active: boolean;
}

import { CircleStage } from './circle-stage.model';

export interface Circle {
    id: number;
    name: string;
    description: string;
    imageSrc: string;
    private: boolean;
    active: boolean;
    stage: CircleStage;
    createdFrom: string;
    validFrom: Date;
    validUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

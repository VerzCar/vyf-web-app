import { Voter } from './voter.model';

export interface Circle {
    id: number;
    name: string;
    description: string;
    imageSrc: string;
    voters: Voter[];
    private: boolean;
    active: boolean;
    createdFrom: string;
    validUntil: Date;
}

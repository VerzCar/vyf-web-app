export interface UserOption {
    maxCircles: number;
    maxVoters: number;
    maxCandidates: number;
    privateOption: UserPrivateOption;
}

export interface UserPrivateOption {
    maxVoters: number;
    maxCandidates: number;
}

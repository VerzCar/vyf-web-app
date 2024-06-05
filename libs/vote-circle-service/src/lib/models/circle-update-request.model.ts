export interface CircleUpdateRequest {
    readonly name?: string;
    readonly description?: string;
    readonly imageSrc?: string;
    readonly validFrom?: Date | null;
    readonly validUntil?: Date | null;
}

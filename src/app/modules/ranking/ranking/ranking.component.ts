import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AvatarImgSize } from '@vyf/component';
import { Placement } from '../models';

interface RankingComponentView {
    placement: Placement;
}

@Component({
    selector: 'app-ranking',
    templateUrl: './ranking.component.html',
    styleUrl: './ranking.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingComponent {
    public readonly view: RankingComponentView;
    public readonly AvatarImgSize = AvatarImgSize;

    private readonly bottomSheetRef = inject(MatBottomSheetRef<RankingComponent>);
    private readonly sheetData = inject(MAT_BOTTOM_SHEET_DATA);

    constructor() {
        this.view = {
            placement: this.sheetData.placement
        };
    }

    public onClose() {
        this.bottomSheetRef.dismiss();
    }
}

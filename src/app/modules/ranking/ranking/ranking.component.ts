import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
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

    private readonly bottomSheetRef = inject(MatBottomSheetRef<RankingComponent>);
    private readonly sheetData = inject(MAT_BOTTOM_SHEET_DATA);

    constructor() {
        console.log(this.sheetData);
        this.view = {
            placement: this.sheetData.placement
        };
    }
}

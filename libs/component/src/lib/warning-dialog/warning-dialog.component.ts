import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

export interface WarningDialogData {
    title: string;
    msg: string;
    cancelText?: string;
    confirmText?: string;
}

@Component({
    selector: 'vyf-warning-dialog',
    standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule
  ],
    templateUrl: './warning-dialog.component.html',
    styleUrl: './warning-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarningDialogComponent {
    public readonly view: WarningDialogData;

    private readonly dialogRef: MatDialogRef<WarningDialogComponent, boolean> = inject(MatDialogRef<WarningDialogComponent, boolean>);
    private readonly dialogData: WarningDialogData = inject(MAT_DIALOG_DATA);

    constructor() {
        this.view = this.dialogData;
    }

    public close() {
        this.dialogRef.close(false);
    }

    public confirm() {
        this.dialogRef.close(true);
    }
}

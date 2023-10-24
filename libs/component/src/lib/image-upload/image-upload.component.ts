import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { map, Observable, Subject, tap } from 'rxjs';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

@Component({
    selector: 'vyf-image-upload',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, FeatherIconModule, RxIf, RxLet, MatProgressSpinnerModule],
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {
    public profileImageSrc$: Observable<string> | undefined;
    public suspenseTrigger$ = new Subject<void>();
    public nextTrigger$ = new Subject<void>();

    @Input()
    public set profileImageSrc(imgSrc$: Observable<string>) {
        this.profileImageSrc$ = imgSrc$.pipe(
            map(src => src.length ? src : this.placeholderImageSrc),
            tap(() => this.nextTrigger$.next())
        );
    }

    @Output() public fileSelected = new EventEmitter<File>();

    public readonly placeholderImageSrc = 'assets/img/placeholder-image.jpg';

    public onFileSelect(event: Event | null) {
        if (event === null) {
            return;
        }

        const inputElement = event.target as HTMLInputElement;

        if (!(inputElement.files && inputElement.files.length)) {
            return;
        }

        const file = inputElement.files[0];

        if (file) {
            this.fileSelected.emit(file);
            this.suspenseTrigger$.next();
        }
    }
}

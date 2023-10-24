import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RxIf } from '@rx-angular/template/if';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

@Component({
    selector: 'vyf-image-upload',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, FeatherIconModule, RxIf],
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {
    @Input() profileImageSrc: string | null = null;
    @Input() isLoading = false;
    @Output() onFileSelected = new EventEmitter<File>();

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
            this.onFileSelected.emit(file);
        }
    }
}

import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RxIf } from '@rx-angular/template/if';
import { ShortNamePipe } from '../pipes/short-name.pipe';
import { AvatarImgSizeClassPipe } from './avatar-img-size-class.pipe';

export enum AvatarImgSize {
    Xs,
    Sm,
    Base,
    Lg,
    Xxl
}

@Component({
    selector: 'vyf-avatar-img',
    standalone: true,
    imports: [NgOptimizedImage, RxIf, ShortNamePipe, NgClass, AvatarImgSizeClassPipe],
    template: `
        <div class="relative rounded block {{size | avatarImgSizeClass}}"
             [ngClass]="{'border-2 border-white': withBorder}">
            <img *rxIf="imageSrc"
                 class="object-cover rounded"
                 ngSrc="{{imageSrc}}"
                 alt="{{username}}"
                 fill="true">
            <div *rxIf="!imageSrc"
                 class="bg-gray-800 text-gray-200 absolute w-full h-full flex items-center justify-center rounded">
                <span class="text-xl text-center uppercase">{{ username | shortName }}</span>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarImgComponent {
    @Input({ required: true }) public imageSrc!: string;
    @Input({ required: true }) public username!: string;
    @Input() public size: AvatarImgSize = AvatarImgSize.Base;
    @Input() public withBorder: boolean = false;
}

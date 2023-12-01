import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { RxIf } from '@rx-angular/template/if';
import { ShortNamePipe } from '@vyf/component';

export enum AvatarImgSize {
    Xs,
    Sm,
    Base,
    Lg
}

@Component({
    selector: 'vyf-avatar-img',
    standalone: true,
    imports: [NgOptimizedImage, RxIf, ShortNamePipe, NgClass],
    template: `
        <img *rxIf="imageSrc"
             class="object-cover rounded"
             ngSrc="{{imageSrc}}"
             alt="{{username}}"
             fill="true">
        <div *rxIf="!imageSrc"
             class="bg-gray-800 text-gray-200 absolute w-full h-full flex items-center justify-center rounded">
            <span class="text-xl uppercase">{{username | shortName}}</span>
        </div>
    `,
    styles: [
        ':host{@apply relative rounded;}',
        ':host{ &.avatar-size-xs{@apply w-8 h-8} }',
        ':host{ &.avatar-size-sm{@apply w-10 h-10} }',
        ':host{ &.avatar-size-base{@apply w-14 h-14} }',
        ':host{ &.avatar-size-lg{@apply w-20 h-20} }',
        ':host{ &.avatar-border{@apply border-2 border-white} }'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarImgComponent {
    @Input({ required: true }) public imageSrc!: string;
    @Input({ required: true }) public username!: string;
    @Input() public size: AvatarImgSize = AvatarImgSize.Base;
    @Input()public withBorder: boolean = false;

    @HostBinding('class.avatar-size-xs') get sizeXs() { return this.size === AvatarImgSize.Xs; }
    @HostBinding('class.avatar-size-sm') get sizeSm() { return this.size === AvatarImgSize.Sm; }
    @HostBinding('class.avatar-size-base') get sizeBase() { return this.size === AvatarImgSize.Base; }
    @HostBinding('class.avatar-size-lg') get sizeLg() { return this.size === AvatarImgSize.Lg; }
    @HostBinding('class.avatar-border') get border() { return this.withBorder }

}

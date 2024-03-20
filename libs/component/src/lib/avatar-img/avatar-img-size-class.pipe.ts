import { Pipe, PipeTransform } from '@angular/core';
import { AvatarImgSize } from './avatar-img.component';

@Pipe({
  name: 'avatarImgSizeClass',
  standalone: true,
})
export class AvatarImgSizeClassPipe implements PipeTransform {
  public transform(size: AvatarImgSize): string {
    switch (size) {
      case AvatarImgSize.Xs:
        return 'w-8 h-8';
      case AvatarImgSize.Sm:
        return 'w-10 h-10';
      case AvatarImgSize.Base:
        return 'w-14 h-14';
      case AvatarImgSize.Lg:
        return 'w-20 h-20';
      case AvatarImgSize.Xxl:
        return 'w-48 h-48';

    }
  }
}

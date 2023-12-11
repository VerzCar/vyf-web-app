import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RxIf } from '@rx-angular/template/if';
import { User } from '@vyf/user-service';
import { Voter } from '@vyf/vote-circle-service';
import { Observable, of } from 'rxjs';
import { AvatarImgComponent, AvatarImgSize } from '../avatar-img/avatar-img.component';
import { CommitmentIconComponent } from '../commitment-icon/commitment-icon.component';
import { CircleMemberCommitmentPipe } from '../pipes/circle-member-commitment.pipe';
import { ShortNamePipe } from '../pipes/short-name.pipe';

interface Member {
    user: User;
    voter: Voter;
}

export interface MemberListItemShowOption {
    commitmentIcon: boolean;
    username: boolean;
    commitment: boolean;
}

export interface MemberListItemOption {
    show: Partial<MemberListItemShowOption>;
}

const defaultOpts: MemberListItemOption = {
    show: {
        commitmentIcon: false,
        username: true,
        commitment: false
    }
};

@Component({
    selector: 'vyf-member-list-item',
    standalone: true,
    imports: [ShortNamePipe, CommitmentIconComponent, RxIf, CircleMemberCommitmentPipe, NgOptimizedImage, MatButtonModule, AvatarImgComponent],
    templateUrl: './member-list-item.component.html',
    styleUrls: ['./member-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListItemComponent {
    @Input({ required: true }) public member!: Member;
    @Input() public opts: Partial<MemberListItemOption> = defaultOpts;
    @Input() public canVote$: Observable<boolean> = of(false);

    @Output() public voted = new EventEmitter<string>();

    public onVote(electedIdentId: string) {
        this.voted.next(electedIdentId);
    }

    protected readonly AvatarImgSize = AvatarImgSize;
}

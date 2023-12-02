import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { User } from '@vyf/user-service';
import { Voter } from '@vyf/vote-circle-service';
import { CommitmentIconComponent } from '../commitment-icon/commitment-icon.component';
import { CircleMemberCommitmentPipe } from '../pipes/circle-member-commitment.pipe';
import { ShortNamePipe } from '../pipes/short-name.pipe';

interface Member {
    user: User;
    voter: Voter;
}

export interface CircleMemberComponentShowOption {
    commitmentIcon: boolean;
    username: boolean;
    commitment: boolean;
}

export interface CircleMemberComponentOption {
    show: Partial<CircleMemberComponentShowOption>;
}

const defaultOpts: CircleMemberComponentOption = {
    show: {
        commitmentIcon: true,
        username: true,
        commitment: true
    }
};

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterLink,
        RxLet,
        RxIf,
        NgOptimizedImage,
        CommitmentIconComponent,
        CircleMemberCommitmentPipe,
        ShortNamePipe
    ],
    selector: 'vyf-circle-member',
    standalone: true,
    styleUrls: ['./circle-member.component.scss'],
    templateUrl: './circle-member.component.html'
})
export class CircleMemberComponent {
    @Input({ required: true }) public member!: Member;

    @Input()
    public set opts(options: Partial<CircleMemberComponentOption>) {
        this._options = {
            show: {
                ...defaultOpts.show,
                ...options.show
            }
        };
    }

    public get opts(): CircleMemberComponentOption {
        return this._options;
    }

    private _options = defaultOpts;
}

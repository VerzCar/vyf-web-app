import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { User } from '@vyf/user-service';
import { Voter } from '@vyf/vote-circle-service';
import { map, Observable } from 'rxjs';
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

interface CircleMemberView {
  member: Member;
  opts: CircleMemberComponentOption;
}

const defaultOpts: CircleMemberComponentOption = {
  show: {
	commitmentIcon: true,
	username: true,
	commitment: true
  }
};

@Component({
  selector: 'vyf-circle-member',
  standalone: true,
  imports: [CommonModule, RouterLink, RxLet, RxIf, NgOptimizedImage, CommitmentIconComponent, CircleMemberCommitmentPipe, ShortNamePipe],
  templateUrl: './circle-member.component.html',
  styleUrls: ['./circle-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleMemberComponent implements OnInit {
  @Input({ required: true }) public member$: Observable<Member> | undefined;
  @Input() public opts: Partial<CircleMemberComponentOption> = defaultOpts;
  public view$: Observable<CircleMemberView> | undefined;

  public ngOnInit(): void {
	this.view$ = this.member$?.pipe(
	  map(member => ({
		member,
		opts: {
		  show: {
			...defaultOpts.show,
			...this.opts.show
		  }
		} as CircleMemberComponentOption
	  }))
	);
  }
}

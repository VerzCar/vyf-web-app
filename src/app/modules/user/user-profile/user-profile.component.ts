import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UserService } from '@vyf/user-service';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  public items: MenuItem[] | undefined;

  private readonly userService = inject(UserService);

  public ngOnInit(): void {
	this.userService.me().subscribe(user => console.log(user));
	this.items = [
	  {
		label: 'Edit',
		icon: PrimeIcons.USER_EDIT,
		routerLink: 'edit'
	  },
	];
  }
}

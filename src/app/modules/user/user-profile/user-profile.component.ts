import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {User, UserService} from '@vyf/user-service';
import { MenuItem, PrimeIcons } from 'primeng/api';
import {map, Observable, tap} from 'rxjs';

interface UserView {
  user: User;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  public items: MenuItem[] | undefined;
  public view$: Observable<UserView> | undefined;

  private readonly userService = inject(UserService);

  public ngOnInit(): void {
	this.defineMenuItems();

	this.view$ = this.userService.me().pipe(
	  map(res => ({
		  user: res.data
		})),
	  tap(u => console.log(u))
	);
  }

  private defineMenuItems() {
	this.items = [
	  {
		label: 'Edit',
		icon: PrimeIcons.USER_EDIT,
		routerLink: 'edit'
	  },
	];
  }
}

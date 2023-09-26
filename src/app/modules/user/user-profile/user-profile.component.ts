import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  public items: MenuItem[] | undefined;

  public ngOnInit(): void {
    this.items = [
      {
        label: 'Edit',
        icon: PrimeIcons.USER_EDIT,
        routerLink: 'edit'
      },
    ]
  }
}

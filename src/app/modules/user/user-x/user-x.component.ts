import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, UserService } from '@vyf/user-service';
import { map, Observable } from 'rxjs';

interface UserView {
  user: User;
}

@Component({
  selector: 'app-user-x',
  templateUrl: './user-x.component.html',
  styleUrls: ['./user-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserXComponent implements OnInit {
  public view$: Observable<UserView> | undefined;

  private readonly userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.view$ = this.userService.x(id ?? '').pipe(
        map(res => res.data),
        map(user => ({
          user: user as User
        }))
    );
  }
}

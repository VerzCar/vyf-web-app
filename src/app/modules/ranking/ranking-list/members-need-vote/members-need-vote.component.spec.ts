import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembersNeedVoteComponent } from './members-need-vote.component';

describe('MembersNeedVoteComponent', () => {
  let component: MembersNeedVoteComponent;
  let fixture: ComponentFixture<MembersNeedVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MembersNeedVoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersNeedVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

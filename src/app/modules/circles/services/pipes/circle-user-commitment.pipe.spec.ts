import { CircleUserCommitmentPipe } from './circle-user-commitment.pipe';

describe('UserCommitmentPipe', () => {
  it('create an instance', () => {
    const pipe = new CircleUserCommitmentPipe();
    expect(pipe).toBeTruthy();
  });
});

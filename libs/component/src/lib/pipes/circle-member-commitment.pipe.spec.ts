import { CircleMemberCommitmentPipe } from './circle-member-commitment.pipe';

describe('UserCommitmentPipe', () => {
  it('create an instance', () => {
    const pipe = new CircleMemberCommitmentPipe();
    expect(pipe).toBeTruthy();
  });
});

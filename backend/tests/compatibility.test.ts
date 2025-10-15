import { computeCompatibility } from '../src/services/compatibility';

describe('computeCompatibility', () => {
  it('computes high score for strong overlaps', () => {
    const res = computeCompatibility(
      { skills: ['React','Node'], interests: ['Web','AI'] },
      { skills: ['React','Node','MongoDB'], interests: ['Web','ML'] },
      { pastCollab: true }
    );
    expect(res.score).toBeGreaterThanOrEqual(70);
    expect(res.breakdown.skillOverlap).toBeGreaterThan(0);
  });

  it('computes low score for no overlaps', () => {
    const res = computeCompatibility(
      { skills: ['Go'], interests: ['Systems'] },
      { skills: ['Ruby'], interests: ['Design'] }
    );
    expect(res.score).toBeLessThan(40);
  });
});



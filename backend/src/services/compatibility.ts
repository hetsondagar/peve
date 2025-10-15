type OverlapResult = { score: number; label: string; breakdown: Record<string, number>; reasons: string[] };

function overlapRatio(a: string[] = [], b: string[] = []): number {
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  const inter = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size || 1;
  return inter / union;
}

export function computeCompatibility(
  userA: { skills?: string[]; interests?: string[] },
  userB: { skills?: string[]; interests?: string[] },
  opts?: { pastCollab?: boolean; similarAvailability?: boolean }
): OverlapResult {
  const skillOverlap = overlapRatio(userA.skills || [], userB.skills || []);
  const interestOverlap = (() => {
    const a = userA.interests || [];
    const b = userB.interests || [];
    if (a.length === 0 && b.length === 0) return 0;
    const setA = new Set(a.map((s) => s.toLowerCase()));
    const setB = new Set(b.map((s) => s.toLowerCase()));
    const inter = [...setA].filter((x) => setB.has(x)).length;
    const denom = Math.max(a.length, b.length) || 1;
    return inter / denom;
  })();
  const pastCollabBonus = opts?.pastCollab ? 0.2 : 0.0;
  const timeAvailabilityBonus = opts?.similarAvailability ? 0.05 : 0.0;

  const raw = skillOverlap * 0.5 + interestOverlap * 0.3 + pastCollabBonus + timeAvailabilityBonus;
  const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);

  const reasons: string[] = [];
  if (skillOverlap > 0) reasons.push('Shared stack');
  if (interestOverlap > 0) reasons.push('Similar interests');
  if (opts?.pastCollab) reasons.push('Past collaboration');

  const label = score >= 80 ? 'Great match' : score >= 60 ? 'Good match' : score >= 40 ? 'Decent match' : 'Low match';
  return {
    score,
    label,
    breakdown: { skillOverlap: Number(skillOverlap.toFixed(2)), interestOverlap: Number(interestOverlap.toFixed(2)), pastCollabBonus, timeAvailabilityBonus },
    reasons,
  };
}



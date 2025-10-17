type OverlapResult = { score: number; label: string; breakdown: Record<string, number>; reasons: string[] };

function overlapRatio(a: string[] = [], b: string[] = []): number {
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  const inter = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size || 1;
  return inter / union;
}

// Enhanced compatibility calculation with new profile structure
export function computeCompatibility(
  userA: any,
  userB: any,
  opts?: { pastCollab?: boolean; similarAvailability?: boolean }
): OverlapResult {
  // Skills overlap (30% weight)
  const skillOverlap = overlapRatio(userA.skills || [], userB.skills || []);
  
  // Preferred roles overlap (20% weight)
  const roleOverlap = overlapRatio(userA.preferredRoles || [], userB.preferredRoles || []);
  
  // Interests overlap (20% weight)
  const interestOverlap = (() => {
    const a = userA.interests || [];
    const b = userB.interests || [];
    if (a.length === 0 && b.length === 0) return 0;
    const setA = new Set(a.map((s: any) => s.toLowerCase()));
    const setB = new Set(b.map((s: any) => s.toLowerCase()));
    const inter = [...setA].filter((x) => setB.has(x)).length;
    const denom = Math.max(a.length, b.length) || 1;
    return inter / denom;
  })();
  
  // Time availability overlap (15% weight)
  const timeOverlap = calculateTimeOverlap(userA, userB);
  
  // Work style compatibility (15% weight)
  const workStyleCompatibility = calculateWorkStyleCompatibility(userA.workStyle || {}, userB.workStyle || {});
  
  // Past collaboration bonus
  const pastCollabBonus = opts?.pastCollab ? 0.1 : 0.0;
  
  // Calculate weighted score
  const raw = (skillOverlap * 0.30) + 
              (roleOverlap * 0.20) + 
              (interestOverlap * 0.20) + 
              (timeOverlap * 0.15) + 
              (workStyleCompatibility * 0.15) + 
              pastCollabBonus;
  
  const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);

  const reasons: string[] = [];
  if (skillOverlap > 0.3) reasons.push('Shared technical skills');
  if (roleOverlap > 0.3) reasons.push('Complementary roles');
  if (interestOverlap > 0.3) reasons.push('Similar interests');
  if (timeOverlap > 0.5) reasons.push('Good time overlap');
  if (workStyleCompatibility > 0.7) reasons.push('Compatible work style');
  if (opts?.pastCollab) reasons.push('Past collaboration');

  const label = score >= 80 ? 'Excellent match' : 
                score >= 65 ? 'Great match' : 
                score >= 50 ? 'Good match' : 
                score >= 35 ? 'Decent match' : 'Low match';
  
  return {
    score,
    label,
    breakdown: { 
      skillOverlap: Number(skillOverlap.toFixed(2)), 
      roleOverlap: Number(roleOverlap.toFixed(2)),
      interestOverlap: Number(interestOverlap.toFixed(2)), 
      timeOverlap: Number(timeOverlap.toFixed(2)),
      workStyleCompatibility: Number(workStyleCompatibility.toFixed(2)),
      pastCollabBonus 
    },
    reasons,
  };
}

// Calculate time availability overlap
function calculateTimeOverlap(userA: any, userB: any): number {
  // If both have flexible hours, give high compatibility
  if (userA.preferredWorkHours === 'flexible' && userB.preferredWorkHours === 'flexible') {
    return 0.8;
  }
  
  // If one is flexible, give medium compatibility
  if (userA.preferredWorkHours === 'flexible' || userB.preferredWorkHours === 'flexible') {
    return 0.6;
  }
  
  // If same preferred hours, give high compatibility
  if (userA.preferredWorkHours === userB.preferredWorkHours) {
    return 0.9;
  }
  
  // Check for complementary hours (morning + evening, etc.)
  const complementary = [
    ['morning', 'evening'],
    ['afternoon', 'evening'],
    ['morning', 'afternoon']
  ];
  
  for (const [hour1, hour2] of complementary) {
    if ((userA.preferredWorkHours === hour1 && userB.preferredWorkHours === hour2) ||
        (userA.preferredWorkHours === hour2 && userB.preferredWorkHours === hour1)) {
      return 0.7;
    }
  }
  
  // Default to low compatibility for conflicting hours
  return 0.3;
}

// Calculate work style compatibility
function calculateWorkStyleCompatibility(workStyleA: any, workStyleB: any): number {
  let compatibility = 0;
  let factors = 0;
  
  // Team preference compatibility
  if (workStyleA.teamPreference && workStyleB.teamPreference) {
    factors++;
    if (workStyleA.teamPreference === workStyleB.teamPreference) {
      compatibility += 1.0;
    } else if (workStyleA.teamPreference === 'mixed' || workStyleB.teamPreference === 'mixed') {
      compatibility += 0.7;
    } else {
      compatibility += 0.3; // collaborative vs independent
    }
  }
  
  // Pace compatibility
  if (workStyleA.pace && workStyleB.pace) {
    factors++;
    if (workStyleA.pace === workStyleB.pace) {
      compatibility += 1.0;
    } else if (workStyleA.pace === 'structured' || workStyleB.pace === 'structured') {
      compatibility += 0.6; // structured works with most
    } else {
      compatibility += 0.4; // fast vs slow-steady
    }
  }
  
  // Communication compatibility
  if (workStyleA.communication && workStyleB.communication) {
    factors++;
    if (workStyleA.communication === workStyleB.communication) {
      compatibility += 1.0;
    } else if (workStyleA.communication === 'asynchronous' || workStyleB.communication === 'asynchronous') {
      compatibility += 0.7; // async works with most
    } else {
      compatibility += 0.3; // frequent vs minimal
    }
  }
  
  // Decision style compatibility
  if (workStyleA.decisionStyle && workStyleB.decisionStyle) {
    factors++;
    if (workStyleA.decisionStyle === workStyleB.decisionStyle) {
      compatibility += 1.0;
    } else if (workStyleA.decisionStyle === 'consensus' || workStyleB.decisionStyle === 'consensus') {
      compatibility += 0.6; // consensus works with most
    } else {
      compatibility += 0.4; // owner-driven vs data-driven
    }
  }
  
  return factors > 0 ? compatibility / factors : 0.5; // Default to neutral if no data
}



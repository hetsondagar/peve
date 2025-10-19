"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compatibility_1 = require("../src/services/compatibility");
describe('computeCompatibility', () => {
    it('computes high score for strong overlaps', () => {
        const res = (0, compatibility_1.computeCompatibility)({ skills: ['React', 'Node'], interests: ['Web', 'AI'] }, { skills: ['React', 'Node', 'MongoDB'], interests: ['Web', 'ML'] }, { pastCollab: true });
        expect(res.score).toBeGreaterThanOrEqual(65);
        expect(res.breakdown.skillOverlap).toBeGreaterThan(0);
    });
    it('computes low score for no overlaps', () => {
        const res = (0, compatibility_1.computeCompatibility)({ skills: ['Go'], interests: ['Systems'] }, { skills: ['Ruby'], interests: ['Design'] });
        expect(res.score).toBeLessThan(40);
    });
});

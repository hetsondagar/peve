"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripEphemeralProjectFields = stripEphemeralProjectFields;
/**
 * Fields present on GitHub analyze / repository-insights API responses
 * that must not be persisted on the Project document.
 */
const EPHEMERAL_PROJECT_KEYS = [
    'intelligence',
    'commitTimeline',
    'contributorLeaders',
    'repoCreatedAt',
    'readmeExcerpt',
    'htmlUrl',
    'networkSignals',
    'peveScorePreview',
    'scoreRationale',
    'commitMessageSample',
];
function stripEphemeralProjectFields(body) {
    for (const k of EPHEMERAL_PROJECT_KEYS) {
        delete body[k];
    }
}

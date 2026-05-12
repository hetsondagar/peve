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
] as const;

export function stripEphemeralProjectFields(body: Record<string, unknown>): void {
  for (const k of EPHEMERAL_PROJECT_KEYS) {
    delete body[k];
  }
}

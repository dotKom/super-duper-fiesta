import { createSelector } from 'reselect';
import { VOTING_FINISHED } from 'common/actionTypes/issues';

export const activeIssueExists = state => (
  state.issues && Object.keys(state.issues).some(id => state.issues[id].active)
);

export const getIssue = state => (
  state.issues[Object.keys(state.issues).find(issueId => state.issues[issueId].active)]
);

const getKeyForIssueObjIfExists = (state, key, defaultValue = undefined) => {
  const issue = getIssue(state);

  if (issue && issue[key] !== undefined) {
    return issue[key];
  }

  return defaultValue;
};

const sortIssues = (a, b) => new Date(b.date) - new Date(a.date);

const concludedIssues = state => (
  state.issues && Object.keys(state.issues)
  .filter(issue => (
    state.issues[issue].status === VOTING_FINISHED
    && !state.issues[issue].active),
  )
  .map(issue => state.issues[issue])
  .sort(sortIssues)
);

export const getLatestConcludedIssue = createSelector(
  concludedIssues,
  issues => (issues.length > 0 ? issues[0] : null),
);

export const getConcludedIssuesExceptLatest = createSelector(
  concludedIssues,
  issues =>
    issues
    .slice(1)
    .reduce((a, b) => ({
      ...a,
      [b.id]: b,
    }), {}),
);

export const getIssueText = state =>
  getKeyForIssueObjIfExists(state, 'text', 'Ingen aktiv sak for øyeblikket.');
export const getIssueId = state =>
  getKeyForIssueObjIfExists(state, 'id', '');
export const getIssueKey = (state, key, defaultValue) =>
  getKeyForIssueObjIfExists(state, key, defaultValue);

export const getOwnVote = createSelector(
  getIssue,
  // eslint-disable-next-line no-confusing-arrow
  issue => issue ? issue.userVoteAlternative : null,
);

const db = require('./postgresql');

const Vote = db.sequelize.models.vote;

function getVotes(question) {
  const issueId = question.id || question;
  return Vote.findAll({ where: { issueId } });
}

function getUserVote(issue, user) {
  const issueId = issue.id || issue;
  const userId = user.id || user;
  return Vote.findOne({ where: { issueId, userId } });
}

function getAnonymousUserVote(issueId, anonymoususerId) {
  return Vote.findOne({ where: { issueId, anonymoususerId } });
}


function createUserVote(userId, issueId, alternativeId) {
  return Vote.create({ userId, issueId, alternativeId });
}

function createAnonymousVote(anonymoususerId, issueId, alternativeId) {
  return Vote.create({ anonymoususerId, issueId, alternativeId });
}

module.exports = {
  getVotes,
  createUserVote,
  createAnonymousVote,
  getUserVote,
  getAnonymousUserVote,
};

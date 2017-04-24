const broadcast = require('../utils').broadcast;
const emit = require('../utils').emit;
const logger = require('../logging');

const addVote = require('../models/vote').addVote;
const generatePublicVote = require('../models/vote').generatePublicVote;
const getActiveGenfors = require('../models/meeting').getActiveGenfors;
const getAnonymousUser = require('../models/user').getAnonymousUser;

const {
  RECEIVE_VOTE: SEND_VOTE,
  SUBMIT_ANONYMOUS_VOTE,
  SUBMIT_REGULAR_VOTE,
  VOTING_STATE,
} = require('../../common/actionTypes/voting');

module.exports = (socket) => {
  socket.on('action', async (data) => {
    switch (data.type) {
      case SUBMIT_REGULAR_VOTE:
        logger.debug('Received vote', { userFullName: socket.request.user.name });
        // eslint-disable-next-line no-underscore-dangle
        addVote(data.issue, socket.request.user, data.alternative, socket.request.user._id)
        .then(async (vote) => {
          logger.debug('Stored new vote. Broadcasting ...');
          emit(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
          broadcast(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
          emit(socket, VOTING_STATE, { voted: true });
        }).catch((err) => {
          logger.error('Storing new vote failed.', err);
          emit(socket, SEND_VOTE, {}, {
            error: 'Storing vote failed.',
          });
        });
        break;
      case SUBMIT_ANONYMOUS_VOTE: {
        logger.debug('Received anonymous vote');
        const genfors = await getActiveGenfors();
        const anonymousUser = await getAnonymousUser(data.passwordHash,
          socket.request.user.onlinewebId, genfors);
        // eslint-disable-next-line no-underscore-dangle
        addVote(data.issue, socket.request.user, data.alternative, anonymousUser._id)
        .then(async (vote) => {
          logger.debug('Stored new anonymous vote. Broadcasting ...');
          emit(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
          broadcast(socket, SEND_VOTE, await generatePublicVote(data.issue, vote));
          emit(socket, VOTING_STATE, { voted: true });
        }).catch((err) => {
          logger.error('Storing new anonymous vote failed.', err);
          emit(socket, SEND_VOTE, {}, {
            error: err.message,
          });
        });
        break;
      }
      default:
        break;
    }
  });
};

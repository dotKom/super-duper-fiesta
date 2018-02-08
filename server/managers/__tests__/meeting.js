jest.mock('../../models/meeting.accessors');
const { endGenfors } = require('../meeting');
const { getGenfors, getActiveGenfors, updateGenfors } = require('../../models/meeting.accessors');
const { generateGenfors, generateUser } = require('../../utils/generateTestData');
const permissionLevels = require('../../../common/auth/permissions');

describe('endGenfors', () => {
  beforeAll(() => {
    updateGenfors.mockImplementation(genfors => generateGenfors({ ...genfors, status: 'closed' }));
  });

  it('ends the current genfors if user has rights to do so', async () => {
    const genfors = generateGenfors();

    const updatedGenfors = await endGenfors(genfors,
      generateUser({ permissions: permissionLevels.IS_SUPERUSER }));

    expect(updatedGenfors).toMatchObject(Object.assign(genfors, { status: 'closed' }));
  });

  it('throws error if user does not have access to close it', async () => {
    const genfors = generateGenfors({ _id: '1' });
    getActiveGenfors.mockImplementation(() => genfors);
    getGenfors.mockImplementation(() => genfors);
    const user = generateUser({ permissions: permissionLevels.IS_LOGGED_IN });

    await expect(endGenfors(genfors, user)).rejects
      .toEqual(new Error('Brukeren har ikke riktig rettigheter'));
  });
});

import React from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import IconText from '../IconText';
import Pin from './Pin';
import { adminCloseIssue } from '../../actionCreators/adminButtons';
import { getIssue } from '../../selectors/issues';
import '../../css/IssueAdmin.css';

const Issue = ({ closeIssue, issue }) => (
  <div className="IssueAdmin">
    <div className="IssueAdmin-heading">
      <Pin code="DEADBEEF" />
      <h2 className="IssueAdmin-title">Aktiv sak</h2>
    </div>
    <div className="IssueAdmin-actions">
      <Button>
        <IconText text="Rediger" iconClass="flaticon-edit" />
      </Button>
      <Button>
        <IconText text="Resett" iconClass="flaticon-refresh" />
      </Button>
      <Button onClick={closeIssue} hidden={!issue}>
        <IconText text="Avslutt" iconClass="flaticon-lock" />
      </Button>
      <Button>
        <IconText text="Slett" iconClass="flaticon-cross" />
      </Button>
    </div>
    <p className="IssueAdmin-text">{issue.text}</p>
  </div>
);

Issue.propTypes = {
  closeIssue: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  issue: getIssue(state),
});

// Following this example since we need id from state
// https://github.com/reactjs/react-redux/issues/237#issuecomment-168817739
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return {
    ...ownProps,
    ...stateProps,
    closeIssue: () => {
      dispatch(adminCloseIssue({ issue: stateProps.issue.id, user: 'admin' }));
    },
  };
};

export default Issue;
export const IssueContainer = connect(
  mapStateToProps,
  null,
  mergeProps,
)(Issue);
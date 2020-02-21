import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Modal,
  TextField,
  MenuItem,
  Button
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages';
import trashIcon from '../../images/trash-icon.svg';
import pencilIcon from '../../images/pencil-icon.svg';
import Immutable from 'seamless-immutable';

const styles = {
  modalContent: {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: '40%',
    height: '60%',
    backgroundColor: '#fff',
    outline: 'none',
    border: '1px solid',
    boxShadow:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
    overflow: 'scroll'
  },
  headerGrid: {
    backgroundColor: '#F6F7F8',
    borderBottom: 'solid 1px',
    paddingBottom: '15px',
    marginBottom: '15px',
  },
  titleLabel: {
    color: '#4E4E4E',
    fontSize: '18px',
    paddingTop: '16px',
    paddingLeft: '16px',
    display: 'inline-block',
    fontFamily: 'Montserrat',
    marginBottom: '32px'
  },
  headerDescriptionLabel: {
    color: '#4E4E4E',
    fontSize: '14px',
    paddingLeft: '16px',
    display: 'inline-block',
    fontFamily: 'Montserrat',
    marginBottom: '16px'
  },
  filterNamesLabels: {
    color: '#A2A7B1',
    fontSize: '12px',
    paddingLeft: '16px',
    display: 'inline-block',
    fontFamily: 'Montserrat',
  },
  dropDown: {
    marginTop: '0px',
    marginBottom: '0px',
    paddingLeft: '16px',
    paddingRight: '16px'
  },
  dropDownInput: {
    borderRadius: '5px',
    borderColor: '#A2A7B1',
    height: '100%',
    color: '#A2A7B1',
    '&:focus': {
      borderRadius: '5px',
      borderColor: '#A2A7B1',
      height: '100%',
      color: '#A2A7B1',
    }
  },
  dropDownMainOption: {
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: '#fff',
    },
    minWidth: '335px',
    borderBottom: '1px solid #4e4e4e',
    cursor: 'default',
  },
  icon: {
    '&:hover': {
      filter: 'invert(0)',
    },
    filter: 'invert(1)',
    cursor: 'pointer',
    position: 'relative',
    top: '4px',
    float: 'right',
    marginRight: '16px',
    height: '18px'
  },
  button: {
    marginRight: '16px',
    marginTop: '16px'
  },
};

class VersionsModal extends React.Component {

  constructor(props) {

    super(props);

    this.initialState = {
      hoverOnExit: false,
      dropDownValuePicked: '',
      versionPicked: null,
      currentEditName: '',
      currentEditDescription: '',
      isEditing: false
    };
    this.state = this.initialState;

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isEditing
      && this.state.versionPicked
      && prevState.versionPicked
      && this.state.versionPicked.agentName !== prevState.versionPicked.agentName) {
      this.setState({
        currentEditDescription: this.state.versionPicked.backupAgentNotes,
        currentEditName: this.state.versionPicked.agentName
      })
    }
    if (!this.state.isEditing &&
      (this.props.agentVersions !== prevProps.agentVersions)) {
      this.handleDropDownValuePicked(this.state.dropDownValuePicked);
    }
  }

  async handleDropDownValuePicked(value) {
    this.setState({ dropDownValuePicked: value });
    var selectedVersion = this.props.agentVersions.find(version => {
      return version.agentName === value;
    })

    const immutableSelectedVersion = Immutable(selectedVersion, {
      deep: true,
    });
    this.setState({ versionPicked: immutableSelectedVersion });
  }

  loadVersion() {
    if (this.props.selectedTab !== 'agent') {
      this.props.onGoToUrl('/agent/' + this.state.versionPicked.id, this.state.versionPicked.id, this.state.versionPicked.backupAgentId)
    } else {
      this.props.onGoToUrl('/agent/' + this.state.versionPicked.id + '/' + this.props.selectedTab, this.state.versionPicked.id, this.state.versionPicked.backupAgentId)
    }
  }

  updateVersion() {
    const mutableVersion = Immutable.asMutable(this.state.versionPicked, {
      deep: true,
    });
    mutableVersion.agentName = this.state.currentEditName;
    mutableVersion.backupAgentNotes = this.state.currentEditDescription;
    this.props.onUpdateAgentVersion(mutableVersion);
    this.setState({
      isEditing: false,
      dropDownValuePicked: mutableVersion.agentName
    })
  }

  handleCurrentEditNameChange = async (ev) => {
    this.setState({ currentEditName: ev.target.value });
  }

  handleCurrentEditDescriptionChange = async (ev) => {
    this.setState({ currentEditDescription: ev.target.value });
  }

  handleCurrentEditNameValidation = async () => {
    if (this.state.currentEditName === '') {
      this.setState({ currentEditName: this.state.versionPicked.agentName });
    }
  }

  getDate(dateString) {
    var d = new Date(Number(dateString));
    return d.toString();
  }

  renderMainHeader(classes, intl) {
    return <Fragment>
      <Grid
        container
        direction="row"
        alignItems="stretch"
      >
        <Grid item xs={6}>
          <span className={classes.titleLabel}>
            {//intl.formatMessage(messages.applyFilter)
              'Version Timestamp'
            }
          </span>
        </Grid>
        <Grid item xs={6}
          style={{
            textAlign: 'end'
          }} >
          {!this.state.isEditing && this.state.versionPicked && (
            <Button className={classes.button} onClick={() => {
              this.loadVersion();
            }} key="btnLoad" variant="contained">
              {'Load'}
            </Button>
          )}
          {
            this.state.isEditing && (
              <Button className={classes.button} onClick={() => {
                this.updateVersion();
              }} key="btnEdit" variant="contained">
                {'Edit Done'}
              </Button>
            )}
        </Grid>
      </Grid>
    </Fragment>
  }

  renderHeaderDescription(classes, intl) {
    return <Grid
      container
      item xs={12}
      direction="row"
      alignItems="stretch"
      style={{
        paddingBottom: '5px'
      }}
    >
      <Grid item xs>
        <span
          className={classes.headerDescriptionLabel}>
          {//this.props.filtersDescription
            'Select a version for this agent'
          }
        </span>
      </Grid>
    </Grid>
  }

  renderDropDownFilter(classes, intl) {
    return <Fragment>
      <span
        className={classes.filterNamesLabels}
      >
        {//this.props.dropDownFilterLabel
          'Switch Version Timestamp:'
        }
      </span>
      <Grid
        container
        item xs={12}
        direction="row"
        alignItems="stretch"
        style={{
          marginTop: '-10px',
          marginBottom: '15px'
        }}
      >
        <Grid
          item xs={12}
          container
          direction="row"
          alignItems="stretch"
          justify="center">
          <TextField
            select
            fullWidth
            margin="normal"
            className={classes.dropDown}
            inputProps={{
              className: classes.dropDownInput
            }}
            value={this.state.dropDownValuePicked}
            onChange={async ev => {
              this.handleDropDownValuePicked(ev.target.value)
            }}
          >
            <MenuItem key={this.props.dropDownMainOptionLabel} value={this.props.dropDownMainOptionLabel}
              className={classes.dropDownMainOption}
            >
              {//this.props.dropDownMainOptionLabel
                'Pick a version'
              }
            </MenuItem>
            {
              this.props.agentVersions && this.props.agentVersions
                .map(version => (
                  <MenuItem key={version.agentName} value={version.agentName}>
                    {version.agentName}
                  </MenuItem>
                ))
            }
          </TextField>
        </Grid>
      </Grid>
    </Fragment>
  }

  renderEditDeleteSection(classes, intl) {
    return <Grid
      container
      item xs={12}
      direction="row"
      alignItems="stretch"
      style={{
        marginBottom: '15px',
        minHeight: '70px'
      }}
    >
      <Grid item xs={6}>
        {!this.state.isEditing && (
          <Fragment>
            <span
              className={classes.filterNamesLabels}>
              {//this.props.filtersDescription
                'Training currently:'
              }
            </span>
            <br />
            <span
              className={classes.headerDescriptionLabel}>
              {//this.props.filtersDescription
                this.state.versionPicked ? this.state.versionPicked.agentName : ''
              }
            </span>
          </Fragment>
        )
        }
        {this.state.isEditing && (
          <TextField
            id="outlined-basic"
            value={this.state.currentEditName}
            label={this.state.isEditing ? 'Edit timestamp name' : ''}
            onChange={async (ev) => { await this.handleCurrentEditNameChange(ev) }}
            onBlur={async () => {
              await this.handleCurrentEditNameValidation();
            }}
            style={{
              width: '100%',
              paddingLeft: '16px',
              paddingRight: '16px',
              marginTop: '0px !important'
            }}
            className={classes.dropDown}
            inputProps={{
              className: classes.dropDownInput
            }}
            InputLabelProps={{
              shrink: true,
              style: { marginLeft: '16px' }
            }}
          >
          </TextField>
        )
        }
      </Grid>
      <Grid item xs={3}>
        <span
          className={classes.filterNamesLabels}>
          {//this.props.filtersDescription
            'Time trained'
          }
        </span>
        <br />
        <span
          className={classes.headerDescriptionLabel}>
          {//this.props.filtersDescription
            this.state.versionPicked ? this.getDate(this.state.versionPicked.creationDate) : ''
          }
        </span>
      </Grid>
      <Grid item xs={3}>
        {this.state.versionPicked && (
          <Fragment>
            <img
              alt=""
              onClick={() => {
                //onClick && !disabled ? onClick() : _.noop;
                this.setState({ isEditing: !this.state.isEditing });
                this.setState({ currentEditName: this.state.versionPicked.agentName })
                this.setState({ currentEditDescription: this.state.versionPicked.backupAgentNotes })
              }}
              className={classes.icon}
              src={pencilIcon}
            />
            <img
              alt=""
              onClick={() => {
                //onClick && !disabled ? onClick() : _.noop;
                this.props.onDeleteAgentVersion(this.state.versionPicked.id, this.state.versionPicked.backupAgentId);
              }}
              className={classes.icon}
              src={trashIcon}
            />
          </Fragment>
        )}
      </Grid>
    </Grid >
  }

  renderVersionDescriptionHeader(classes, intl) {
    return <Grid
      container
      item xs={12}
      direction="row"
      alignItems="stretch"
    >
      <Grid item xs>
        <span
          className={classes.filterNamesLabels}>
          {//this.props.filtersDescription
            'Training Info'
          }
        </span>
      </Grid>
    </Grid>
  }

  renderVersionDescription(classes, intl) {
    return <Grid
      container
      item xs={12}
      direction="row"
      alignItems="stretch"
    >
      <Grid item xs>
        {!this.state.isEditing && (
          <span
            className={classes.headerDescriptionLabel}>
            {
              this.state.versionPicked ? this.state.versionPicked.backupAgentNotes : ''
            }
          </span>)}
        {this.state.isEditing && (
          <TextField
            id="outlined-basic"
            multiline
            rows={4}
            value={this.state.currentEditDescription}
            onChange={async (ev) => { await this.handleCurrentEditDescriptionChange(ev) }}
            style={{
              width: '100%',
              paddingLeft: '16px',
              paddingRight: '16px',
              marginTop: '0px !important'
            }}

          >
          </TextField>
        )
        }
      </Grid>
    </Grid>
  }

  render() {
    const { classes, intl } = this.props;
    return (
      <Grid container>
        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.props.open}
            onClose={this.props.onClose}
            style={{ overflow: 'scroll' }}
          >
            <div className={classes.modalContent}>
              <Grid
                className={classes.headerGrid}>
                {this.renderMainHeader(classes, intl)}
                {this.renderHeaderDescription(classes, intl)}
              </Grid>
              {this.renderDropDownFilter(classes, intl)}
              {this.renderEditDeleteSection(classes, intl)}
              {this.renderVersionDescriptionHeader(classes, intl)}
              {this.renderVersionDescription(classes, intl)}
            </div>
          </Modal>
        </div>
      </Grid>
    );
  }
}

VersionsModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  agentVersions: PropTypes.array,
  selectedTab: PropTypes.string,
  onGoToUrl: PropTypes.func,
  onAddNewAgentBackup: PropTypes.func,
  onUpdateAgentVersion: PropTypes.func,
  onDeleteAgentVersion: PropTypes.func,
};

export default injectIntl(withStyles(styles)(VersionsModal));
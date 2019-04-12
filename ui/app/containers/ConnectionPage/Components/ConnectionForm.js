import React from "react";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import PropTypes from "prop-types";
import { Grid, Typography, Button, Modal, TextField, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import messages from "../messages";

import playHelpIcon from "../../../images/play-help-icon.svg";
import DeleteFooter from "../../../components/DeleteFooter";

const styles = {
  headerContainer: {
    backgroundColor: "#f6f7f8",
    border: "1px solid #c5cbd8",
    borderRadius: "5px",
    marginBottom: "60px",
  },
  titleContainer: {
    padding: "25px",
  },
  titleTextHelpContainer: {
    display: "inline",
    position: "relative",
    bottom: "6px",
  },
  title: {
    display: "inline",
    paddingRight: "25px",
  },
  formDescriptionContainer: {
    margin: '15px 0px',
  },
  formDescription: {
    fontSize: '14px',
    fontWeight: 300,
  },
  helpButton: {
    display: "inline",
    width: "50px",
    height: "20px",
  },
  playIcon: {
    height: "10px",
  },
  helpText: {
    fontSize: "9px",
    fontWeight: 300,
    position: "relative",
    bottom: "2px",
    paddingLeft: "2px",
  },
  modalContent: {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: '80%',
    height: '80%',
    backgroundColor: "#fff",
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #c5cbd8',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  formSubContainer: {
    padding: '40px 25px',
  },
  uiColorLabel: {
    marginTop: '13px',
    marginBottom: '10px',
    color: '#a2a7b1',
    fontWeight: 400,
    fontSize: '12px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class ConnectionForm extends React.Component {
  state = {
    openModal: false,
  };

  handleOpen = () => {
    this.setState({
      openModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false,
    });
  };

  render() {
    const { classes, intl, connection, channels, agents } = this.props;
    return (
      <Grid className={classes.headerContainer} container item xs={12}>
        <Grid className={classes.titleContainer} item xs={12}>
          <Grid className={classes.titleTextHelpContainer} container>
            <Typography className={classes.title} variant="h2">
              <FormattedMessage {...messages.connectionFormTitle} />
            </Typography>
            <Button
              className={classes.helpButton}
              variant="outlined"
              onClick={this.handleOpen}
            >
              <img
                className={classes.playIcon}
                src={playHelpIcon}
                alt={intl.formatMessage(messages.playHelpAlt)}
              />
              <span className={classes.helpText}>
                <FormattedMessage {...messages.help} />
              </span>
            </Button>
            <Modal open={this.state.openModal} onClose={this.handleClose}>
              <Grid className={classes.modalContent} container>
                <iframe
                  width='100%'
                  height='100%'
                  src="https://www.youtube.com/embed/Gus06Z1-cNw"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </Grid>
            </Modal>
          </Grid>
          <Grid className={classes.formDescriptionContainer} container>
            <Typography className={classes.formDescription}>
              <FormattedMessage {...messages.connectionFormDescription} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid className={classes.formContainer} container item xs={12}>
            <Grid className={classes.formSubContainer} id='formContainer' container item xs={12}>   
              <Grid container spacing={24} item xs={12}>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    select
                    id='channel'
                    value={connection.channel || 'select'}
                    label={intl.formatMessage(messages.channelSelect)}
                    onChange={(evt) => { this.props.onChangeConnectionData('channel', evt.target.value === 'select' ? '' : evt.target.value) }}
                    margin='normal'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={intl.formatMessage(messages.requiredField)}
                    error={this.props.errorState.channel}
                  >
                    <MenuItem key={'select'} value='select'>
                      <FormattedMessage {...messages.selectAValue} />
                    </MenuItem>
                    {Object.keys(channels).map((channel) => {
                      return (
                        <MenuItem key={channel} value={channel}>
                          {channels[channel].name}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    select
                    id='agent'
                    value={connection.agent || 'select'}
                    label={intl.formatMessage(messages.agentSelect)}
                    onChange={(evt) => { this.props.onChangeConnectionData('agent', evt.target.value === 'select' ? '' : parseInt(evt.target.value)) }}
                    margin='normal'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={intl.formatMessage(messages.requiredField)}
                    error={this.props.errorState.agent}
                  >
                    <MenuItem key={'select'} value='select'>
                      <FormattedMessage {...messages.selectAValue} />
                    </MenuItem>
                    {agents.map((agent) => {
                      return (
                        <MenuItem key={agent.id} value={agent.id}>
                          {agent.agentName}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {this.props.newConnection ? 
          null : 
          <DeleteFooter
            onDelete={this.props.onDelete}
            type={intl.formatMessage(messages.instanceName)}
          />
        }
      </Grid>
    );
  }
}

ConnectionForm.propTypes = {
  channels: PropTypes.object,
  agents: PropTypes.array,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  connection: PropTypes.object,
  onChangeConnectionData: PropTypes.func,
  errorState: PropTypes.object,
  onDelete: PropTypes.func,
  newConnection: PropTypes.bool,
};

export default injectIntl(withStyles(styles)(ConnectionForm));
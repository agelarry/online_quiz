/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';;
//import Checkbox from 'material-ui/Checkbox';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import * as actionCreators from '../actions/auth';

import { validateEmail } from '../utils/misc';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

@connect(mapStateToProps, mapDispatchToProps)
export default class RegisterView extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/login';
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            school: 1,
            userType: 0,
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });

        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
            });
        }

        if (this.state.password === '' || !this.state.password) {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });

        }

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false,
            });
        }

    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    handleSchoolChange = (event, index, value) => this.setState({school: value});

    handleTypeChange = (event, index, value) => this.setState({userType: value});

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.login(e);
            }
        }
    }

    login(e) {
        e.preventDefault();
        this.props.registerUser(this.state.email, this.state.password, this.state.firstName, this.state.lastName, this.state.school, this.state.userType, this.state.redirectTo);
    }

    render() {
        return (
            <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
                <Paper style={style}>
                    <div className="text-center">
                        <h2>Register to view protected content!</h2>
                        {
                            this.props.registerStatusText &&
                                <div className="alert alert-info">
                                    {this.props.registerStatusText}
                                </div>
                        }

                        <div className="col-md-12">
                            <TextField
                              hintText="Email"
                              floatingLabelText="Email"
                              type="email"
                              errorText={this.state.email_error_text}
                              onChange={(e) => this.changeValue(e, 'email')}
                            />
                        </div>
                        <div className="col-md-12">
                            <TextField
                              hintText="Password"
                              floatingLabelText="Password"
                              type="password"
                              errorText={this.state.password_error_text}
                              onChange={(e) => this.changeValue(e, 'password')}
                            />
                        </div>
                         <div className="col-md-12">
                            <TextField
                              hintText="First Name"
                              floatingLabelText="First Name"
                              type="firstName"
                              //errorText={this.state.password_error_text}
                              onChange={(e) => this.changeValue(e, 'firstName')}
                            />
                        </div>
                        <div className="col-md-12">
                            <TextField
                              hintText="Last Name"
                              floatingLabelText="Last Name"
                              type="lastName"
                              //errorText={this.state.password_error_text}
                              onChange={(e) => this.changeValue(e, 'lastName')}
                            />
                        </div>
                         <div className="col-md-12">
                            <SelectField
                                floatingLabelText="School"
                                value={this.state.school}
                                onChange={this.handleSchoolChange}
                             >
                                <MenuItem value={"Number One High School"} primaryText="Number One High School" />
                                <MenuItem value={"Number Two High School"} primaryText="Number Two High School" />
                                <MenuItem value={"Number Three High School"} primaryText="Number Three High School" />
                            </SelectField>
                        </div>
                         <div className="col-md-12">
                            <SelectField
                                floatingLabelText="User Type"
                                value={this.state.userType}
                                onChange={this.handleTypeChange}
                             >
                                <MenuItem value={0} primaryText="Teacher" />
                                <MenuItem value={1} primaryText="Student" />
                            </SelectField>
                        </div>


                        <RaisedButton
                          disabled={this.state.disabled}
                          style={{ marginTop: 50 }}
                          label="Submit"
                          onClick={(e) => this.login(e)}
                        />

                    </div>
                </Paper>

            </div>
        );

    }
}

RegisterView.propTypes = {
    registerUser: React.PropTypes.func,
    registerStatusText: React.PropTypes.string,
};

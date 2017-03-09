import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import * as actionCreators from '../actions/auth';
import {create_quiz} from '../utils/http_functions';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';
import {browserHistory} from 'react-router';

const text_style = {
  'word-wrap': 'break-word',
}

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class CreateQuizView extends React.Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }

    initData(editQuizId) {
          var self = this;
          axios.post('/api/teacher_get_quiz_with_id', {
                id: editQuizId,
          })
          .then(function (response) {
                //alert(JSON.stringify(response.data['title']));
                self.setState({
                    quizId: editQuizId,
                    teacherId: response.data['teacherId'],
                    title: response.data['title'],
                    article: response.data['article'],
                    choiceQ1: response.data['choiceQ1'],
                    choiceQ1A: response.data['choiceQ1A'],
                    choiceQ1B: response.data['choiceQ1B'],
                    choiceQ1C: response.data['choiceQ1C'],
                    choiceQ1D: response.data['choiceQ1D'],
                    choiceQ2: response.data['choiceQ2'],
                    choiceQ2A: response.data['choiceQ2A'],
                    choiceQ2B: response.data['choiceQ2B'],
                    choiceQ2C: response.data['choiceQ2C'],
                    choiceQ2D: response.data['choiceQ2D'],
                    choiceQ3: response.data['choiceQ3'],
                    choiceQ3A: response.data['choiceQ3A'],
                    choiceQ3B: response.data['choiceQ3B'],
                    choiceQ3C: response.data['choiceQ3C'],
                    choiceQ3D: response.data['choiceQ3D'],
                    choiceQ1Solution: response.data['choiceQ1Solution'],
                    choiceQ2Solution: response.data['choiceQ2Solution'],
                    choiceQ3Solution: response.data['choiceQ3Solution'],
                    essayQ1: response.data['essayQ1'],
                });
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    constructor(props) {
        super(props);
        const redirectRoute = '/teacherManageQuiz';
        this.state = {
            finished: false,
            stepIndex: 0,
            quizId: '',
            title: "",
            article: "",
            choiceSelectedOption: '3',
            essaySelectedOption: '1',
            choiceQ1: "",
            choiceQ1A: "",
            choiceQ1B: "",
            choiceQ1C: "",
            choiceQ1D: "",
            choiceQ1Solution: '',
            choiceQ2: "",
            choiceQ2A: "",
            choiceQ2B: "",
            choiceQ2C: "",
            choiceQ2D: "",
            choiceQ2Solution: '',
            choiceQ3: "",
            choiceQ3A: "",
            choiceQ3B: "",
            choiceQ3C: "",
            choiceQ3D: "",
            choiceQ3Solution: '',
            essayQ1: "",
            choiceQ1SolutionErrorText: null,
            choiceQ2SolutionErrorText: null,
            choiceQ3SolutionErrorText: null,
            choiceQ4SolutionErrorText: null,
            choiceQ5SolutionErrorText: null,
        };
        var editQuizId = localStorage.getItem('editQuizId');
        if (editQuizId){
            alert("edit quiz id : " + editQuizId);
            this.initData(editQuizId);
        }
    }



  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
    if (stepIndex >=2 ){
        create_quiz(this.state.quizId, this.props.data.data.id, this.props.data.data.school, this.state.title, this.state.article, this.state.choiceQ1, this.state.choiceQ2, this.state.choiceQ3, this.state.essayQ1, this.state.choiceQ1A, this.state.choiceQ1B, this.state.choiceQ1C, this.state.choiceQ1D, this.state.choiceQ2A, this.state.choiceQ2B, this.state.choiceQ2C, this.state.choiceQ2D, this.state.choiceQ3A, this.state.choiceQ3B, this.state.choiceQ3C, this.state.choiceQ3D, this.state.choiceQ1Solution, this.state.choiceQ2Solution, this.state.choiceQ3Solution, this.state.redirectTo);
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleManageQuiz = () => {
    browserHistory.push('/teacherManageQuiz');
  };

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state);
    }

  handleC1SolutionSelectChange = (event, index, value) => {
        this.setState({choiceQ1Solution:value});
  }

  handleC2SolutionSelectChange = (event, index, value) => {
        this.setState({choiceQ2Solution:value});
  }

  handleC3SolutionSelectChange = (event, index, value) => {
        this.setState({choiceQ3Solution:value});
  }

  handleChoiceOptionChange = (changeEvent) => {
    this.setState({
      choiceSelectedOption: changeEvent.target.value
    });
  };

  handleEssayOptionChange = (changeEvent) => {
    this.setState({
      essaySelectedOption: changeEvent.target.value
    });
  };

  getStepContent(stepIndex) {
    var articleField =  <div>
                           <TextField
                              hintText="Title of the Quiz"
                              floatingLabelText="Title of the Quiz"
                              value={this.state.title}
                              onChange={(e) => this.changeValue(e, 'title')}
                           /><br />

                           <TextField
                              hintText="Article to read"
                              floatingLabelText="Article to read"
                              value={this.state.article}
                              onChange={(e) => this.changeValue(e, 'article')}
                              multiLine={true}
                              fullWidth={true}
                              rows={10}
                              rowsMax={30}
                           /><br />
                        </div> ;

    var choiceProblemField = <div>
                                <p>Number of Choice Problem {this.state.choiceSelectedOption}</p>
                                <RadioButtonGroup name="choiceNumber" defaultSelected={this.state.choiceSelectedOption} onChange={this.handleChoiceOptionChange}>
                                  <RadioButton
                                    value='0'
                                    label="0 Choice Problem"
                                  />
                                  <RadioButton
                                    value='1'
                                    label="1 Choice Problem"
                                  />
                                  <RadioButton
                                    value='2'
                                    label="2 Choice Problems"
                                  />
                                  <RadioButton
                                    value='3'
                                    label="3 Choice Problems"
                                  />
                                </RadioButtonGroup>
                                <br />

                                <p>Number of Essay Problem {this.state.essaySelectedOption}</p>
                                <RadioButtonGroup name="essayNumber" defaultSelected={this.state.essaySelectedOption} onChange={this.handleEssayOptionChange}>
                                  <RadioButton
                                    value='0'
                                    label="0 Essay Problem"
                                  />
                                  <RadioButton
                                    value='1'
                                    label="1 Essay Problem"
                                  />
                                </RadioButtonGroup>
                                <br />

                                <div>
                                    {this.state.choiceSelectedOption=='0'
                                        ?<p>'You decide to not create choice problem'</p>
                                        :
                                        <p>Total number of choice problem(s): {this.state.choiceSelectedOption}</p>
                                    }

                                    {this.state.choiceSelectedOption>0
                                        ?
                                        <div>
                                         <h3>Choice Problem 1</h3>
                                            <SelectField
                                              floatingLabelText="Solution"
                                              value={this.state.choiceQ1Solution}
                                              errorText={this.state.choiceQ1SolutionErrorText}
                                              onChange={this.handleC1SolutionSelectChange}
                                            >
                                              <MenuItem value={'A'} primaryText="A" />
                                              <MenuItem value={'B'} primaryText="B" />
                                              <MenuItem value={'C'} primaryText="C" />
                                              <MenuItem value={'C'} primaryText="D" />
                                            </SelectField>
                                          <Paper zDepth={2}>
                                            <TextField hintText="Question" floatingLabelText="Question" defaultValue={this.state.choiceQ1}  onChange={(e) => this.changeValue(e, 'choiceQ1')}  multiLine={true} fullWidth={true} rows={2} rowsMax={5} underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice A" floatingLabelText="Choice A" defaultValue={this.state.choiceQ1A} onChange={(e) => this.changeValue(e, 'choiceQ1A')} multiLine={true} fullWidth={true} rows={1} rowsMax={2} underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice B" floatingLabelText="Choice B" defaultValue={this.state.choiceQ1B} onChange={(e) => this.changeValue(e, 'choiceQ1B')} multiLine={true} fullWidth={true} rows={1} rowsMax={2} underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice C" floatingLabelText="Choice C" defaultValue={this.state.choiceQ1C} onChange={(e) => this.changeValue(e, 'choiceQ1C')} multiLine={true} fullWidth={true} rows={1} rowsMax={2} underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice D" floatingLabelText="Choice D" defaultValue={this.state.choiceQ1D} onChange={(e) => this.changeValue(e, 'choiceQ1D')} multiLine={true} fullWidth={true} rows={1} rowsMax={2} underlineShow={false} />
                                            <Divider />
                                          </Paper>
                                          <br />
                                        </div>
                                        :
                                        <br />
                                    }

                                    {this.state.choiceSelectedOption>1
                                        ?
                                        <div>
                                         <h3>Choice Problem 2</h3>
                                            <SelectField
                                              floatingLabelText="Solution"
                                              value={this.state.choiceQ2Solution}
                                              errorText={this.state.choiceQ2SolutionErrorText}
                                              onChange={this.handleC2SolutionSelectChange}
                                            >
                                              <MenuItem value={'A'} primaryText="A" />
                                              <MenuItem value={'B'} primaryText="B" />
                                              <MenuItem value={'C'} primaryText="C" />
                                              <MenuItem value={'C'} primaryText="D" />
                                            </SelectField>
                                          <Paper zDepth={2}>
                                            <TextField hintText="Question" floatingLabelText="Question" defaultValue={this.state.choiceQ2}  onChange={(e) => this.changeValue(e, 'choiceQ2')}  multiLine={true} fullWidth={true} rows={2} rowsMax={5}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice A" floatingLabelText="Choice A" defaultValue={this.state.choiceQ2A} onChange={(e) => this.changeValue(e, 'choiceQ2A')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice B" floatingLabelText="Choice B" defaultValue={this.state.choiceQ2B} onChange={(e) => this.changeValue(e, 'choiceQ2B')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice C" floatingLabelText="Choice C" defaultValue={this.state.choiceQ2C} onChange={(e) => this.changeValue(e, 'choiceQ2C')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice D" floatingLabelText="Choice D" defaultValue={this.state.choiceQ2D} onChange={(e) => this.changeValue(e, 'choiceQ2D')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                          </Paper>
                                          <br />
                                        </div>
                                        :
                                        <br />
                                    }

                                    {this.state.choiceSelectedOption>2
                                        ?
                                        <div>
                                         <h3>Choice Problem 3</h3>
                                            <SelectField
                                              floatingLabelText="Solution"
                                              value={this.state.choiceQ3Solution}
                                              errorText={this.state.choiceQ3SolutionErrorText}
                                              onChange={this.handleC3SolutionSelectChange}
                                            >
                                              <MenuItem value={'A'} primaryText="A" />
                                              <MenuItem value={'B'} primaryText="B" />
                                              <MenuItem value={'C'} primaryText="C" />
                                              <MenuItem value={'C'} primaryText="D" />
                                            </SelectField>
                                          <Paper zDepth={2}>
                                            <TextField hintText="Question" floatingLabelText="Question" defaultValue={this.state.choiceQ3}  onChange={(e) => this.changeValue(e, 'choiceQ3')}  multiLine={true} fullWidth={true} rows={2} rowsMax={5}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice A" floatingLabelText="Choice A" defaultValue={this.state.choiceQ3A} onChange={(e) => this.changeValue(e, 'choiceQ3A')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice B" floatingLabelText="Choice B" defaultValue={this.state.choiceQ3B} onChange={(e) => this.changeValue(e, 'choiceQ3B')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice C" floatingLabelText="Choice C" defaultValue={this.state.choiceQ3C} onChange={(e) => this.changeValue(e, 'choiceQ3C')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                            <TextField hintText="Choice D" floatingLabelText="Choice D" defaultValue={this.state.choiceQ3D} onChange={(e) => this.changeValue(e, 'choiceQ3D')} multiLine={true} fullWidth={true} rows={1} rowsMax={2}underlineShow={false} />
                                            <Divider />
                                          </Paper>
                                          <br />
                                        </div>
                                        :
                                        <br />
                                    }

                               </div>

                                  {this.state.essaySelectedOption=='1'
                                  ?
                                  <div>
                                  <p>Total number of essay problem: {this.state.essaySelectedOption}</p>
                                  <h3>Essay Problem 1</h3>
                                  <Paper zDepth={2}>
                                    <TextField hintText="Essay Question" floatingLabelText="Essay Question" defaultValue={this.state.essayQ1} onChange={(e) => this.changeValue(e, 'essayQ1')} multiLine={true} fullWidth={true} rows={3} rowsMax={5}underlineShow={false} />
                                    <Divider />
                                  </Paper>
                                  </div>
                                  :
                                  <p>'You decide to not create essay problem'</p>
                                  }
                                  <br />
                            </div>;

    var reviewField = <div>
                        <p>'Review and set solution before finish the quiz creation!'</p>
                        <h1>{this.state.title}</h1>
                            <br />
                        <Paper zDepth={2}>
                            <p style={text_style}>{this.state.article}</p>
                        </Paper>

                        {this.state.choiceSelectedOption>0
                        ?
                        <div>
                        <h2>Choice Problem 1</h2>
                        <p>Solution : {this.state.choiceQ1Solution}</p>
                        <Paper zDepth={2}>
                            <p style={text_style}>Question : {this.state.choiceQ1}</p>
                            <br />
                            <p style={text_style}>A : {this.state.choiceQ1A}</p>
                            <br />
                            <p style={text_style}>B : {this.state.choiceQ1B}</p>
                            <br />
                            <p style={text_style}>C : {this.state.choiceQ1C}</p>
                            <br />
                            <p style={text_style}>D : {this.state.choiceQ1D}</p>
                            <br />
                        </Paper>
                       </div>
                       :
                       <br />
                       }

                       {this.state.choiceSelectedOption>1
                        ?
                        <div>
                        <h2>Choice Problem 2</h2>
                        <p>Solution : {this.state.choiceQ2Solution}</p>
                        <Paper zDepth={2}>
                            <p style={text_style}>Question : {this.state.choiceQ2}</p>
                            <br />
                            <p style={text_style}>A : {this.state.choiceQ2A}</p>
                            <br />
                            <p style={text_style}>B : {this.state.choiceQ2B}</p>
                            <br />
                            <p style={text_style}>C : {this.state.choiceQ2C}</p>
                            <br />
                            <p style={text_style}>D : {this.state.choiceQ2D}</p>
                            <br />
                        </Paper>
                       </div>
                       :
                       <br />
                       }

                       {this.state.choiceSelectedOption>2
                        ?
                        <div>
                        <h2>Choice Problem 3</h2>
                        <p>Solution : {this.state.choiceQ3Solution}</p>
                        <Paper zDepth={2}>
                            <p style={text_style}>Question : {this.state.choiceQ3}</p>
                            <br />
                            <p style={text_style}>A : {this.state.choiceQ3A}</p>
                            <br />
                            <p style={text_style}>B : {this.state.choiceQ3B}</p>
                            <br />
                            <p style={text_style}>C : {this.state.choiceQ3C}</p>
                            <br />
                            <p style={text_style}>D : {this.state.choiceQ3D}</p>
                            <br />
                        </Paper>
                       </div>
                       :
                       <br />
                       }

                        {this.state.essaySelectedOption=='1'
                         ?
                            <div>
                             <h2>Essay Problem</h2>
                             <Paper zDepth={2}>
                             <p style={text_style}>{this.state.essayQ1}</p>
                             </Paper>
                             </div>
                          :
                             <br />
                           }
                            </div>;

    switch (stepIndex) {
      case 0:
        return articleField;
      case 1:
        return choiceProblemField;
      case 2:
        return reviewField;
      default:
        return <p>'Error!'</p>;
    }
  }

    render() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};

        return (
            <div className="col-md-8">
                <h1>Create Quiz</h1>
                <hr />
                 <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
                    <Stepper activeStep={stepIndex}>
                      <Step>
                        <StepLabel>Create Article</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Create Choice and/or Essay Problems</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Review</StepLabel>
                      </Step>
                    </Stepper>
                    <div style={contentStyle}>
                      {finished ? (
                         <div>
                            <p>
                              <a
                                href="#"
                                onClick={(event) => {
                                  event.preventDefault();
                                  this.setState({stepIndex: 0, finished: false});
                                }}
                              >
                                Click here
                              </a> to reset and create more quizzes.
                            </p>
                                <RaisedButton
                                  label="Manage Quiz"
                                  primary={true}
                                  onTouchTap={this.handleManageQuiz}
                                />
                         </div>
                      ) : (
                        <div>
                          {this.getStepContent(stepIndex)}
                          <div style={{marginTop: 12}}>
                            <FlatButton
                              label="Back"
                              disabled={stepIndex === 0}
                              onTouchTap={this.handlePrev}
                              style={{marginRight: 12}}
                            />
                            <RaisedButton
                              label={stepIndex === 2 ? 'Finish' : 'Next'}
                              primary={true}
                              onTouchTap={this.handleNext}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

        );
    }
}

CreateQuizView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};

export default CreateQuizView;

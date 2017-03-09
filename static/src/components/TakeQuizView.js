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
class TakeQuizView extends React.Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
        alert("get here");
    }

    initData(takeQuizId) {
          var self = this;
          axios.post('/api/student_get_quiz_with_id', {
                id: takeQuizId,
          })
          .then(function (response) {
                //alert(JSON.stringify(response.data['title']));
                self.setState({
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
                    essayQ1: response.data['essayQ1'],
                });
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    constructor(props) {
        super(props);
        //alert(this.props.data.data.id);
        const redirectRoute = '/studentManageQuiz';
        const takeQuizId = localStorage.getItem('takeQuizId');
        this.state = {
            finished: false,
            problemFinished: false,
            quizId: takeQuizId,
            stepIndex: 0,
            questionIndex: 0,
            teacherId: '',
            title: '',
            article: '',
            choiceQ1: '',
            choiceQ1A: '',
            choiceQ1B: '',
            choiceQ1C: '',
            choiceQ1D: '',
            choiceQ2: '',
            choiceQ2A: '',
            choiceQ2B: '',
            choiceQ2C: '',
            choiceQ2D: '',
            choiceQ3: '',
            choiceQ3A: '',
            choiceQ3B: '',
            choiceQ3C: '',
            choiceQ3D: '',
            essayQ1: '',
            choiceQ1Answer: '',
            choiceQ2Answer: '',
            choiceQ3Answer: '',
            essayQ1Answer: '',
            choiceQ1SolutionErrorText: null,
            choiceQ2SolutionErrorText: null,
            choiceQ3SolutionErrorText: null,
            takeQuizId: takeQuizId,
        };
        this.initData(takeQuizId);
    }



  handleNext = () => {
    var self = this;
    var teacherViewQuiz = localStorage.getItem('teacherViewQuiz');
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
    if (stepIndex >=1 ){
        if (teacherViewQuiz == 1){
            localStorage.setItem('teacherViewQuiz', 0);
            alert('teacher preview, answer NOT sent');
        }else{
            axios.post('/api/create_answer', {
              quizId: self.state.quizId,
              teacherId: self.state.teacherId,
              studentId: self.props.data.data.id,
              title: self.state.title,
              choiceQ1Answer: self.state.choiceQ1Answer,
              choiceQ2Answer: self.state.choiceQ2Answer,
              choiceQ3Answer: self.state.choiceQ3Answer,
              essayQ1Answer: self.state.essayQ1Answer,
            })
            localStorage.removeItem('takeQuizId');
            alert('answer sent');
        }
    }
  };

  handleQuestionNext = () => {
    const {questionIndex} = this.state;
    this.setState({
      questionIndex: questionIndex + 1,
      problemFinished: questionIndex >= 3,
    });
    if (questionIndex >=3 ){
        alert('no more questions, answer finished');
    }
  };

  handleQuestionPrev = () => {
    const {questionIndex} = this.state;
    if (questionIndex > 0) {
      this.setState({questionIndex: questionIndex - 1});
    }
  };

  handleChoiceQ1OptionChange = (changeEvent) => {
    this.setState({
      choiceQ1Answer: changeEvent.target.value
    });
  };

  handleChoiceQ2OptionChange = (changeEvent) => {
    this.setState({
      choiceQ2Answer: changeEvent.target.value
    });
  };

  handleChoiceQ3OptionChange = (changeEvent) => {
    this.setState({
      choiceQ3Answer: changeEvent.target.value
    });
  };

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state);
    }

  getStepContent(stepIndex) {
    var articleField =  <div>
                            <h1>{this.state.title}</h1>
                                <br />
                            <Paper zDepth={2}>
                                <p style={text_style}>{this.state.article}</p>
                            </Paper>
                        </div> ;

    var choiceProblemField =  <div>
                              <div style={{width: '45%', maxWidth: 600, float: 'left'}}>
                                <h1>{this.state.title}</h1>
                                    <br />
                                <Paper zDepth={2}>
                                    <p style={text_style}>{this.state.article}</p>
                                </Paper>
                              </div>

                              <div style={{width: '50%', maxWidth: 600, float: 'right'}}>

                                    {this.state.questionIndex == 0 && this.state.choiceQ1 != ''?
                                        <div>
                                            <h4>Question : {this.state.choiceQ1}</h4>

                                             <RadioButtonGroup name="choiceQ1" defaultSelected={this.state.choiceQ1Answer} onChange={this.handleChoiceQ1OptionChange}>
                                              <RadioButton
                                                value={'A'}
                                                label={'A . ' + this.state.choiceQ1A}
                                              />
                                              <RadioButton
                                                value={'B'}
                                                label={'B . ' + this.state.choiceQ1B}
                                              />
                                              <RadioButton
                                                value={'C'}
                                                label={'C . ' + this.state.choiceQ1C}
                                              />
                                              <RadioButton
                                                value={'D'}
                                                label={'D . ' + this.state.choiceQ1D}
                                              />
                                            </RadioButtonGroup>
                                            <br />
                                        </div>
                                        :
                                        <br/>
                                    }
                                    {this.state.questionIndex == 1 && this.state.choiceQ2 != ''?
                                        <div>
                                            <h4>Question : {this.state.choiceQ2}</h4>

                                             <RadioButtonGroup name="choiceQ2" defaultSelected={this.state.choiceQ2Answer} onChange={this.handleChoiceQ2OptionChange}>
                                              <RadioButton
                                                value={'A'}
                                                label={'A . ' + this.state.choiceQ2A}
                                              />
                                              <RadioButton
                                                value={'B'}
                                                label={'B . ' + this.state.choiceQ2B}
                                              />
                                              <RadioButton
                                                value={'C'}
                                                label={'C . ' + this.state.choiceQ2C}
                                              />
                                              <RadioButton
                                                value={'D'}
                                                label={'D . ' + this.state.choiceQ2D}
                                              />
                                            </RadioButtonGroup>
                                            <br />
                                        </div>
                                        :
                                        <br/>
                                    }
                                    {this.state.questionIndex == 2 && this.state.choiceQ3 != ''?
                                        <div>
                                            <h4>Question : {this.state.choiceQ3}</h4>

                                             <RadioButtonGroup name="choiceQ3" defaultSelected={this.state.choiceQ3Answer} onChange={this.handleChoiceQ3OptionChange}>
                                              <RadioButton
                                                value={'A'}
                                                label={'A . ' + this.state.choiceQ3A}
                                              />
                                              <RadioButton
                                                value={'B'}
                                                label={'B . ' + this.state.choiceQ3B}
                                              />
                                              <RadioButton
                                                value={'C'}
                                                label={'C . ' + this.state.choiceQ3C}
                                              />
                                              <RadioButton
                                                value={'D'}
                                                label={'D . ' + this.state.choiceQ3D}
                                              />
                                            </RadioButtonGroup>
                                            <br />
                                        </div>
                                        :
                                        <br/>
                                    }
                                    {this.state.questionIndex == 3 && this.state.essayQ1 != ''?
                                        <div>
                                          <h4>Question : {this.state.essayQ1}</h4>
                                          <Paper zDepth={2}>
                                            <TextField hintText="Essay Answer" floatingLabelText="Essay Answer" defaultValue={this.state.essayQ1Answer} onChange={(e) => this.changeValue(e, 'essayQ1Answer')} multiLine={true} fullWidth={true} rows={10} rowsMax={20}underlineShow={false} />
                                            <Divider />
                                          </Paper>
                                        </div>
                                        :
                                        <br/>
                                    }
                                    {this.state.problemFinished?
                                        <p>not more problems, click submit button to upload</p>
                                    :
                                       <div style={{marginTop: 12}}>
                                        <FlatButton
                                          label="Previous Question"
                                          disabled={this.state.questionIndex === 0}
                                          onTouchTap={this.handleQuestionPrev}
                                          style={{marginRight: 12}}
                                        />
                                        <RaisedButton
                                          label={this.state.questionIndex === 3 ? 'Done' : 'Next Question'}
                                          primary={true}
                                          onTouchTap={this.handleQuestionNext}
                                        />
                                      </div>
                                    }


                             </div>

                          </div>
                            ;

    var reviewField = <div>
                        <p>Congratulations, you finished the quiz!</p>
                      </div>;

    switch (stepIndex) {
      case 0:
        return articleField;
      case 1:
        return choiceProblemField;
      case 2:
        return reviewField;
      default:
        return <p>'Your answer was sent!'</p>;
    }
  }

    render() {
        const {finished, stepIndex, problemFinished} = this.state;
        const contentStyle = {margin: '0 16px'};

        return (
            <div className="col-md-12">
                <h1>Quiz Id=>{this.state.takeQuizId}</h1>
                <hr />
                 <div style={{width: '100%', maxWidth: 1200, margin: 'auto'}}>
                    <Stepper activeStep={stepIndex}>
                      <Step>
                        <StepLabel>Quick View the Article</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Answer Problems</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Finish</StepLabel>
                      </Step>
                    </Stepper>
                    <div style={contentStyle}>
                      {stepIndex == 1 && !problemFinished? (
                        <div>
                        {this.getStepContent(stepIndex)}
                        <br/>
                        </div>
                      ) : (
                        <div>
                          {this.getStepContent(stepIndex)}
                          {stepIndex != 2?
                               <div style={{marginTop: 12, float: 'right'}}>
                                <RaisedButton
                                  label={stepIndex === 1 ? 'Submit' : 'Next'}
                                  primary={true}
                                  onTouchTap={this.handleNext}
                                />
                              </div>
                            :
                            <br/>
                          }

                        </div>
                      )}
                    </div>
                  </div>
                </div>

        );
    }
}

TakeQuizView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};

export default TakeQuizView;

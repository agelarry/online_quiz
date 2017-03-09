import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import * as actionCreators from '../actions/data';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {browserHistory} from 'react-router';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

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
export default class ManageAssessments extends React.Component {
    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        var self = this;
        const token = this.props.token;
        this.props.fetchProtectedData(token);
        axios.post('/api/teacher_get_quiz_list', {
                teacherId: this.props.data.data.id,
          })
          .then(function (response) {
            self.setState({quizList: response.data});
          })
          .catch(function (error) {
            alert(error);
          });

         axios.post('/api/teacher_get_answer_list', {
                teacherId: this.props.data.data.id,
          })
          .then(function (response) {
            //alert(JSON.stringify(response.data));
            self.setState({answerList: response.data});
          })
          .catch(function (error) {
            alert(error);
          });

          axios.post('/api/teacher_get_student_grade_list', {
                teacherId: this.props.data.data.id,
          })
          .then(function (response) {
            //alert(JSON.stringify(response.data));
            self.setState({gradeList: response.data});
          })
          .catch(function (error) {
            alert(error);
          });

    }

    constructor(props) {
        super(props);
        this.state = {
          grading: false,
          answerToGrade:{},
          answerChoiceGrade:0,
          answerEssayQ1IdeaGrade:'0',
          answerEssayQ1GrammaGrade:'0',
          value: 'a',
          quizList:[],
          answerList:[],
          gradeList:[],
          selectedQuizRowId: '',
          selectedAnswerRowId: '',
        }

        this.handleQuizRowSelection = this.handleQuizRowSelection.bind(this);
        this.handleAnswerRowSelection = this.handleAnswerRowSelection.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
        this.handleGradeDone = this.handleGradeDone.bind(this);

        localStorage.removeItem('editQuizId');
    }

    handleQuizRowSelection(rowIds) {
        if (rowIds == null || rowIds == [] || rowIds.length == 0){
            this.setState({selectedQuizRowId: ''});
        }else{
            this.setState({selectedQuizRowId: rowIds[0]});
        }
    };

     handleAnswerRowSelection(rowIds) {
        if (rowIds == null || rowIds == [] || rowIds.length == 0){
            this.setState({selectedAnswerRowId: ''});
        }else{
            this.setState({selectedAnswerRowId: rowIds[0]});
        }
    };

    handleView = () => {
        //this.fetchData();
        if (this.state.selectedQuizRowId === ''){
            alert('No quiz selected');
        }else{
           localStorage.setItem('teacherViewQuiz', 1);
           localStorage.setItem('takeQuizId', JSON.stringify(this.state.quizList[this.state.selectedQuizRowId]['id']));
           browserHistory.push('/takeQuiz');
        }
    };

    handleEdit = () => {
        //this.fetchData();
        if (this.state.selectedQuizRowId === ''){
            alert('No quiz selected');
        }else{
           localStorage.setItem('editQuizId', JSON.stringify(this.state.quizList[this.state.selectedQuizRowId]['id']));
           browserHistory.push('/createQuiz');
        }
    };

    handleDelete = () => {
        if (this.state.selectedQuizRowId === ''){
            alert('No quiz selected');
        }else if (this.state.quizList[this.state.selectedQuizRowId]['assigned'] != '0'){
            alert("Assigned quiz can Not be deleted")
        }else{
           axios.post('api/delete_quiz_with_id', {
                id : this.state.quizList[this.state.selectedQuizRowId]['id'],
            });
        }
        self = this;
        axios.post('/api/teacher_get_quiz_list', {
                teacherId: this.props.data.data.id,
          })
          .then(function (response) {
            self.setState({quizList: response.data});
          })
          .catch(function (error) {
            alert(error);
          });
    };

    handleAssign = () => {
        if (this.state.selectedQuizRowId === ''){
            alert('No quiz selected');
        }else{
           axios.post('api/assign_quiz_with_id', {
                id : this.state.quizList[this.state.selectedQuizRowId]['id'],
            });
        }
        self = this;
        axios.post('/api/teacher_get_quiz_list', {
                teacherId: this.props.data.data.id,
          })
          .then(function (response) {
            self.setState({quizList: response.data});
          })
          .catch(function (error) {
            alert(error);
          });
    };

    handleAnswerEssayQ1IdeaGradeChange = (event, index, value) => {
        this.setState({answerEssayQ1IdeaGrade:value});
    }

    handleAnswerEssayQ1GrammaGradeChange = (event, index, value) => {
        this.setState({answerEssayQ1GrammaGrade:value});
    }

    handleGrade = () => {
        self = this;
        if (this.state.selectedAnswerRowId === ''){
            alert('No answer selected');
        }else{
          this.setState({grading:true});
            //alert(JSON.stringify(this.state.answerList[this.state.selectedAnswerRowId]));
          axios.post("/api/get_answer_to_grade_with_answerId_quizId", {
                id: self.state.answerList[self.state.selectedAnswerRowId]['id'],
                quizId: self.state.answerList[self.state.selectedAnswerRowId]['quizId'],
          })
          .then(function (response) {
            //calculate choice score
            var answerToGrade = response.data;
            var choiceGrade = 0;
            if (answerToGrade['choiceQ1Solution'] != '' && answerToGrade['choiceQ1Solution'] == answerToGrade['choiceQ1Answer']){
                choiceGrade = choiceGrade + 1;
            }
            if (answerToGrade['choiceQ2Solution'] != '' && answerToGrade['choiceQ2Solution'] == answerToGrade['choiceQ2Answer']){
                choiceGrade = choiceGrade + 1;
            }
            if (answerToGrade['choiceQ3Solution'] != '' && answerToGrade['choiceQ3Solution'] == answerToGrade['choiceQ3Answer']){
                choiceGrade = choiceGrade + 1;
            }
            //answerToGrade['choiceGrade'] = choiceGrade;
            self.setState({
                answerToGrade: answerToGrade,
                answerChoiceGrade: choiceGrade,
            });
            //alert(JSON.stringify(response.data));
          })
          .catch(function (error) {
            alert(error);
          });

        }
    };

    handleGradeDone = () => {
        self = this;
        this.setState({grading:false});
        //alert(this.state.answerList[this.state.selectedAnswerRowId]['id'])
        axios.post('/api/teacher_grade_answer_with_answerId', {
            id: self.state.answerToGrade['id'],
            choiceGrade: self.state.answerChoiceGrade,
            essayIdeaGrade: self.state.answerEssayQ1IdeaGrade,
            essayGrammaGrade: self.state.answerEssayQ1GrammaGrade,
          })
          .then(function (response) {
            self.setState({
                answerToGrade: {},
                answerChoiceGrade: 0,
                answerEssayQ1IdeaGrade: '0',
                answerEssayQ1GrammaGrade: '0',
                selectedAnswerRowId: ''
            });
          })
          .catch(function (error) {
            alert(error);
          });

          axios.post('/api/teacher_get_answer_list', {
                teacherId: this.props.data.data.id,
          })
          .then(function (response) {
            //alert(JSON.stringify(response.data));
            self.setState({answerList: response.data});
          })
          .catch(function (error) {
            alert(error);
          });
    };

    render() {

        const quizList = this.state.quizList;
        const answerList = this.state.answerList;
        const gradeList = this.state.gradeList;

        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Manage Quizzes Here, School=>{this.props.data.data.school}!</h1>
                        {this.props.data.data.userType==0
                            ?
                            <div><h1>Teacher</h1>
                              <Tabs>
                                <Tab label="My Activity" >
                                    <div className="quizList">
                                         <Table
                                            onRowSelection={this.handleQuizRowSelection}
                                            >
                                          <TableHeader displaySelectAll={false}>
                                            <TableRow>
                                                <TableHeaderColumn>ID</TableHeaderColumn>
                                                <TableHeaderColumn>title</TableHeaderColumn>
                                                <TableHeaderColumn>Assigned</TableHeaderColumn>
                                              </TableRow>
                                          </TableHeader>
                                              <TableBody
                                                deselectOnClickaway={false}
                                                >
                                                  {quizList.map((quiz) =>
                                                    <TableRow>
                                                    <TableRowColumn> {quiz['id']} </TableRowColumn>
                                                    <TableRowColumn> {quiz['title']} </TableRowColumn>
                                                    <TableRowColumn> {quiz['assigned']=='0'?'NO':'YES'} </TableRowColumn>
                                                    </TableRow>
                                                  )}
                                              </TableBody>
                                           </Table>;
                                    </div>

                                    <RaisedButton
                                      label={'View'}
                                      primary={true}
                                      onTouchTap={this.handleView}
                                    />
                                    <RaisedButton
                                      label={'Edit'}
                                      primary={true}
                                      onTouchTap={this.handleEdit}
                                    />
                                    <RaisedButton
                                      label={'Delete'}
                                      primary={true}
                                      onTouchTap={this.handleDelete}
                                    />
                                    <RaisedButton
                                      label={'Assign'}
                                      primary={true}
                                      onTouchTap={this.handleAssign}
                                    />

                                </Tab>

                                <Tab label="Grade Quiz" >
                                    {this.state.grading
                                    ?
                                    <div>
                                        <Paper zDepth={2}>
                                            <h2>Title : {this.state.answerList[this.state.selectedAnswerRowId]['title']}</h2>
                                            <Divider />
                                            <h3>Choice Problems Score : {this.state.answerChoiceGrade}</h3>
                                            <p>Answer: {this.state.answerToGrade['choiceQ1Answer']}{this.state.answerToGrade['choiceQ2Answer']}{this.state.answerToGrade['choiceQ3Answer']}</p>
                                            <p>Solution : {this.state.answerToGrade['choiceQ1Solution']}{this.state.answerToGrade['choiceQ2Solution']}{this.state.answerToGrade['choiceQ3Solution']}</p>
                                            <Divider />
                                            <h3>Essay Problem Score: </h3>
                                            <div>
                                                 <SelectField
                                                  floatingLabelText="Essay Q1 Idea Score"
                                                  value={this.state.answerEssayQ1IdeaGrade}
                                                  onChange={this.handleAnswerEssayQ1IdeaGradeChange}
                                                >
                                                  <MenuItem value={0} primaryText="0" />
                                                  <MenuItem value={1} primaryText="1" />
                                                  <MenuItem value={2} primaryText="2" />
                                                  <MenuItem value={3} primaryText="3" />
                                                  <MenuItem value={4} primaryText="4" />
                                                  <MenuItem value={5} primaryText="5" />
                                                </SelectField>
                                                <br/>
                                                 <SelectField
                                                  floatingLabelText="Essay Q1 Grammar Score"
                                                  value={this.state.answerEssayQ1GrammaGrade}
                                                  onChange={this.handleAnswerEssayQ1GrammaGradeChange}
                                                >
                                                  <MenuItem value={0} primaryText="0" />
                                                  <MenuItem value={1} primaryText="1" />
                                                  <MenuItem value={2} primaryText="2" />
                                                  <MenuItem value={3} primaryText="3" />
                                                  <MenuItem value={4} primaryText="4" />
                                                  <MenuItem value={5} primaryText="5" />
                                                </SelectField>
                                            </div>
                                            <p style={text_style}>{this.state.answerToGrade['essayQ1Answer']}</p>
                                        </Paper>
                                        <RaisedButton
                                          label={'Done'}
                                          primary={true}
                                          onTouchTap={this.handleGradeDone}
                                        />
                                     </div>
                                    :
                                     <div className="answerList">
                                             <Table
                                                onRowSelection={this.handleAnswerRowSelection}
                                                >
                                              <TableHeader displaySelectAll={false}>
                                                <TableRow>
                                                    <TableHeaderColumn>ID</TableHeaderColumn>
                                                    <TableHeaderColumn>Title</TableHeaderColumn>
                                                    <TableHeaderColumn>Student ID</TableHeaderColumn>
                                                    <TableHeaderColumn>Grade(choice/essayIdea/essayGrammar)</TableHeaderColumn>
                                                  </TableRow>
                                              </TableHeader>
                                                  <TableBody
                                                    deselectOnClickaway={false}
                                                    >
                                                      {answerList.map((answer) =>
                                                        <TableRow>
                                                        <TableRowColumn> {answer['id']} </TableRowColumn>
                                                        <TableRowColumn> {answer['title']} </TableRowColumn>
                                                        <TableRowColumn> {answer['studentId']} </TableRowColumn>
                                                        <TableRowColumn> {answer['graded']=='1'?'NEW':answer['choiceGrade'] + "/" + answer['essayIdeaGrade'] + "/" + answer['essayGrammaGrade']} </TableRowColumn>
                                                        </TableRow>
                                                      )}
                                                  </TableBody>
                                               </Table>

                                         <RaisedButton
                                          label={'Grade'}
                                          primary={true}
                                          onTouchTap={this.handleGrade}
                                        />
                                     </div>
                                    }


                                </Tab>

                                <Tab label="Reports" >
                                  <div>
                                           <Table>
                                              <TableHeader displaySelectAll={false}>
                                                <TableRow>
                                                    <TableHeaderColumn>Student ID</TableHeaderColumn>
                                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                                     {quizList.map((quiz) =>
                                                        <TableHeaderColumn>{quiz['title']}</TableHeaderColumn>
                                                     )}
                                                    <TableHeaderColumn>Total Grade</TableHeaderColumn>
                                                  </TableRow>
                                              </TableHeader>
                                                  <TableBody
                                                    deselectOnClickaway={false}
                                                    >
                                                    {gradeList.map((studentGrade) =>
                                                        <TableRow>
                                                            <TableRowColumn>{studentGrade['studentId']}</TableRowColumn>
                                                            <TableRowColumn>{studentGrade['studentName']}</TableRowColumn>
                                                               {quizList.map((quiz) =>
                                                                    <TableRowColumn>{studentGrade[quiz['title']]}</TableRowColumn>
                                                               )}
                                                            <TableRowColumn>{studentGrade['totalGrade']}</TableRowColumn>
                                                         </TableRow>
                                                     )}
                                                  </TableBody>
                                           </Table>
                                  </div>
                                </Tab>
                              </Tabs>
                              </div>

                            :
                            <h1>Student</h1>
                        }
                    </div>
                }
            </div>
        );
    }
}

ManageAssessments.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};

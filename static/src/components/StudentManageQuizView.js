import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import * as actionCreators from '../actions/data';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import axios from 'axios';
import {browserHistory} from 'react-router';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

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
        axios.post('/api/student_get_quiz_list', {
                school: this.props.data.data.school,
                studentId: this.props.data.data.id,
          })
          .then(function (response) {
            self.setState({quizList: response.data});
            //alert(JSON.stringify(response.data));
            const quizList = response.data;
            if (quizList.length != 0){
                var sumGrade = 0;
                for (var i = 0; i < quizList.length; i++){
                    if (quizList[i]['graded'] == 2){
                        if (quizList[i]['choiceGrade'] != ''){
                            sumGrade = sumGrade + parseInt(quizList[i]['choiceGrade']);
                        }
                        if (quizList[i]['essayIdeaGrade'] != ''){
                            sumGrade = sumGrade + parseInt(quizList[i]['essayIdeaGrade']);
                        }
                        if (quizList[i]['essayGrammaGrade'] != ''){
                            sumGrade = sumGrade + parseInt(quizList[i]['essayGrammaGrade']);
                        }
                    }
                }
                self.setState({sumGrade: sumGrade});
            }
          })
          .catch(function (error) {
            alert(error);
          });
    }

    constructor(props) {
        super(props);
        this.state = {
          value: 'a',
          quizList:[],
          selectedRowId: '',
          sumGrade: 0,
        }

        this.handleRowSelection = this.handleRowSelection.bind(this);
        localStorage.removeItem('teacherViewQuiz');
    }

    handleRowSelection(rowIds) {
        if (rowIds == null || rowIds == [] || rowIds.length == 0){
            this.setState({selectedRowId: ''});
        }else{
            this.setState({selectedRowId: rowIds[0]});
        }
    };

    handleTake = () => {
        if (this.state.selectedRowId === ''){
            alert('No quiz selected');
        }else{
           //alert("quiz to sol id ++ " + this.state.quizList[this.state.selectedRowId]['id']);
           localStorage.setItem('teacherViewQuiz', 0);
           localStorage.setItem('takeQuizId', JSON.stringify(this.state.quizList[this.state.selectedRowId]['id']));
           browserHistory.push('/takeQuiz');
        }
    };

    getStatus=(quiz)=>{
        if (quiz['graded'] == 0){
            return 'NEW';
        }else if(quiz['graded'] == 1){
            return 'Finished';
        }else{
            return quiz['choiceGrade'] + '/' + quiz['essayIdeaGrade'] + '/' + quiz['essayGrammaGrade'];
        }
    }

    render() {

        const list = this.state.quizList;

        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Manage Assessments Here, School=>
                            {this.props.data.data.school}!</h1>
                        {this.props.data.data.userType==1
                            ?
                            <div><h1>Student</h1>

                               <Tabs>
                                 <Tab label="My Activity" >
                                    <div className="quizList">
                                         <Table
                                            onRowSelection={this.handleRowSelection}
                                            >
                                          <TableHeader displaySelectAll={false}>
                                            <TableRow>
                                                <TableHeaderColumn>ID</TableHeaderColumn>
                                                <TableHeaderColumn>title</TableHeaderColumn>
                                                <TableHeaderColumn>Status</TableHeaderColumn>
                                              </TableRow>
                                          </TableHeader>
                                              <TableBody
                                                deselectOnClickaway={false}
                                                >
                                                  {list.map((quiz) =>
                                                    <TableRow selectable={quiz['graded']==0?true:false}>
                                                    <TableRowColumn> {quiz['id']} </TableRowColumn>
                                                    <TableRowColumn> {quiz['title']} </TableRowColumn>
                                                    <TableRowColumn> {this.getStatus(quiz)} </TableRowColumn>
                                                    </TableRow>
                                                  )}
                                              </TableBody>
                                           </Table>
                                    </div>

                                    <RaisedButton
                                      label={'Take'}
                                      primary={true}
                                      onTouchTap={this.handleTake}
                                    />
                                 </Tab>

                                 <Tab label="Reports" >
                                    <div>
                                        <Table>
                                          <TableHeader displaySelectAll={false}>
                                            <TableRow>
                                                <TableHeaderColumn>Quiz Title</TableHeaderColumn>
                                                <TableHeaderColumn>Grade</TableHeaderColumn>
                                              </TableRow>
                                          </TableHeader>
                                              <TableBody
                                                deselectOnClickaway={false}
                                                >
                                                  {list.map((quiz) =>
                                                    <TableRow>
                                                    <TableRowColumn> {quiz['title']} </TableRowColumn>
                                                    <TableRowColumn> {this.getStatus(quiz)} </TableRowColumn>
                                                    </TableRow>
                                                  )}
                                              </TableBody>
                                         </Table>
                                      <h1>Total Grade: {this.state.sumGrade}</h1>
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

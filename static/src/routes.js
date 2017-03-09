/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProtectedView from './components/ProtectedView';
import CreateQuizView from './components/CreateQuizView';
import TeacherManageQuizView from './components/TeacherManageQuizView';
import TakeQuizView from './components/TakeQuizView';
import StudentManageQuizView from './components/StudentManageQuizView';
import NotFound from './components/NotFound';

import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';

export default (
    <Route path="/" component={App}>
        <Route path="main" component={requireAuthentication(ProtectedView)} />
        <Route path="login" component={requireNoAuthentication(LoginView)} />
        <Route path="register" component={requireNoAuthentication(RegisterView)} />
        <Route path="home" component={requireNoAuthentication(HomeContainer)} />
        <Route path="createQuiz" component={requireAuthentication(CreateQuizView)} />
        <Route path="teacherManageQuiz" component={requireAuthentication(TeacherManageQuizView)} />
        <Route path="takeQuiz" component={requireAuthentication(TakeQuizView)} />
        <Route path="studentManageQuiz" component={requireAuthentication(StudentManageQuizView)} />
        <Route path="*" component={DetermineAuth(NotFound)} />
    </Route>
);

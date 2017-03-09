/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password, firstName, lastName, school, userType) {
    return axios.post('api/create_user', {
        email,
        password,
        firstName,
        lastName,
        school,
        userType,
    });
}

export function get_token(email, password) {
    return axios.post('api/get_token', {
        email,
        password,
    });
}

export function has_github_token(token) {
    return axios.get('api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('api/user', tokenConfig(token));
}

export function create_quiz(quizId, teacherId, school, title, article, choiceQ1, choiceQ2, choiceQ3, essayQ1, choiceQ1A, choiceQ1B, choiceQ1C, choiceQ1D, choiceQ2A, choiceQ2B, choiceQ2C, choiceQ2D, choiceQ3A, choiceQ3B, choiceQ3C, choiceQ3D, choiceQ1Solution, choiceQ2Solution, choiceQ3Solution) {
    return axios.post('api/create_quiz', {
        quizId,
        teacherId,
        school,
        title,
        article,
        choiceQ1,
        choiceQ2,
        choiceQ3,
        essayQ1,
        choiceQ1A,
        choiceQ1B,
        choiceQ1C,
        choiceQ1D,
        choiceQ2A,
        choiceQ2B,
        choiceQ2C,
        choiceQ2D,
        choiceQ3A,
        choiceQ3B,
        choiceQ3C,
        choiceQ3D,
        choiceQ1Solution,
        choiceQ2Solution,
        choiceQ3Solution,
    });
}

from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Quiz, Answer
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    print(incoming)
    user = User(
        email=incoming["email"],
        password=incoming["password"],
        firstName=incoming["firstName"],
        lastName=incoming["lastName"],
        school=incoming["school"],
        userType=incoming["userType"],
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )

@app.route("/api/create_quiz", methods=["POST"])
def create_quiz():
    incoming = request.get_json()
    print(incoming)
    quizId = incoming['quizId']
    quiz = None
    if quizId != '':
        quiz = Quiz.get_quiz_with_id(int(quizId))
    if quiz:
        quiz.title=incoming["title"],
        quiz.article=incoming["article"],
        quiz.choiceQ1=incoming["choiceQ1"],
        quiz.choiceQ2=incoming["choiceQ2"],
        quiz.choiceQ3=incoming["choiceQ3"],
        quiz.essayQ1=incoming["essayQ1"],
        quiz.choiceQ1A=incoming["choiceQ1A"],
        quiz.choiceQ1B=incoming["choiceQ1B"],
        quiz.choiceQ1C=incoming["choiceQ1C"],
        quiz.choiceQ1D=incoming["choiceQ1D"],
        quiz.choiceQ2A=incoming["choiceQ2A"],
        quiz.choiceQ2B=incoming["choiceQ2B"],
        quiz.choiceQ2C=incoming["choiceQ2C"],
        quiz.choiceQ2D=incoming["choiceQ2D"],
        quiz.choiceQ3A=incoming["choiceQ3A"],
        quiz.choiceQ3B=incoming["choiceQ3B"],
        quiz.choiceQ3C=incoming["choiceQ3C"],
        quiz.choiceQ3D=incoming["choiceQ3D"],
        quiz.choiceQ1Solution=incoming["choiceQ1Solution"],
        quiz.choiceQ2Solution=incoming["choiceQ2Solution"],
        quiz.choiceQ3Solution=incoming["choiceQ3Solution"],
    else:
        quiz = Quiz(
            teacherId=incoming["teacherId"],
            school=incoming["school"],
            title=incoming["title"],
            article=incoming["article"],
            choiceQ1=incoming["choiceQ1"],
            choiceQ2=incoming["choiceQ2"],
            choiceQ3=incoming["choiceQ3"],
            essayQ1=incoming["essayQ1"],
            choiceQ1A=incoming["choiceQ1A"],
            choiceQ1B=incoming["choiceQ1B"],
            choiceQ1C=incoming["choiceQ1C"],
            choiceQ1D=incoming["choiceQ1D"],
            choiceQ2A=incoming["choiceQ2A"],
            choiceQ2B=incoming["choiceQ2B"],
            choiceQ2C=incoming["choiceQ2C"],
            choiceQ2D=incoming["choiceQ2D"],
            choiceQ3A=incoming["choiceQ3A"],
            choiceQ3B=incoming["choiceQ3B"],
            choiceQ3C=incoming["choiceQ3C"],
            choiceQ3D=incoming["choiceQ3D"],
            choiceQ1Solution=incoming["choiceQ1Solution"],
            choiceQ2Solution=incoming["choiceQ2Solution"],
            choiceQ3Solution=incoming["choiceQ3Solution"],
        )
    db.session.add(quiz)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Quiz with that title already exists"), 409

    #new_quiz = Quiz.query.filter_by(title=incoming["title"]).first()

    return jsonify(
        id=quiz.id,
        #token=generate_token(new_quiz)
    )

@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403

@app.route("/api/teacher_get_student_grade_list", methods=["POST"])
def teacher_get_student_grade_list():
    incoming = request.get_json()
    print(incoming)
    quiz_list = Quiz.get_quiz_with_teacherId(incoming["teacherId"])
    teacher = User.get_user_with_id(incoming["teacherId"])
    if not teacher:
        return jsonify(message="teacher did not delete successfully"), 409
    school = teacher.school
    student_list = User.get_student_with_school(school)
    result_list = []
    #for each student, get answers array
    if not student_list:
        return jsonify(result_list)
    for student in student_list:
        student_name = student.firstName.strip() + ' ' + student.lastName.strip()
        student_detail = {'studentId': student.id, 'studentName': student_name}
        totalGrade = 0
        if not quiz_list:
            return jsonify(result_list)
        for quiz in quiz_list:
            answer = Answer.get_answer_with_studentId_quizId(student.id, quiz.id)
            # dict quiz title, grade
            if not answer:
                student_detail[quiz.title] = 'Unsolved'
            else:
                if int(answer.graded) == 1:#not graded
                    student_detail[quiz.title] = 'Ungraded'
                else:
                    if int(answer.graded) == 2:
                        student_detail[quiz.title] = str(answer.choiceGrade) + "/" + str(answer.essayIdeaGrade) + "/" + str(answer.essayGrammaGrade)
                        totalGrade += int(answer.choiceGrade) + int(answer.essayIdeaGrade) + int(answer.essayGrammaGrade)
                    else:
                        student_detail[quiz.title] = 'Unknown'
        student_detail['totalGrade'] = totalGrade
        result_list.append(student_detail)
    return jsonify(result_list)

@app.route("/api/teacher_get_quiz_list", methods=["POST"])
def teacher_get_quiz_list():
    incoming = request.get_json()
    print(incoming)
    quiz_list = Quiz.get_quiz_with_teacherId(incoming["teacherId"])
    result_list = []
    if quiz_list:
        for quiz in quiz_list:
            result_list.append({ 'id': quiz.id, 'teacher': quiz.teacherId, 'assigned': quiz.assigned, 'title': quiz.title})
        #print(result_list)
    return jsonify(result_list)

@app.route("/api/teacher_get_answer_list", methods=["POST"])
def teacher_get_answer_list():
    incoming = request.get_json()
    print(incoming)
    answer_list = Answer.get_answer_with_teacherId(incoming["teacherId"])
    result_list = []
    if answer_list:
        for answer in answer_list:
            result_list.append({ 'id': answer.id, 'quizId': answer.quizId, 'studentId': answer.studentId, 'title': answer.title, 'graded': answer.graded, 'choiceGrade': answer.choiceGrade, 'essayIdeaGrade': answer.essayIdeaGrade, 'essayGrammaGrade': answer.essayGrammaGrade})
        #print(result_list)
    return jsonify(result_list)

@app.route("/api/get_answer_with_answerId", methods=["POST"])
def get_answer_with_answerId():
    incoming = request.get_json()
    print(incoming)
    answer = Answer.get_answer_with_id(incoming["id"])
    if answer:
        return jsonify({ 'id': answer.id, 'quizId': answer.quizId, 'studentId': answer.studentId, 'title': answer.title, 'choiceQ1Answer': answer.choiceQ1Answer,  'choiceQ2Answer': answer.choiceQ2Answer, 'choiceQ3Answer': answer.choiceQ3Answer, 'essayQ1Answer': answer.essayQ1Answer, 'graded': answer.graded, 'choiceGrade': answer.choiceGrade, 'essayIdeaGrade': answer.essayIdeaGrade, 'essayGrammaGrade': answer.essayGrammaGrade})
        #print(result_list)
    return jsonify(id=incoming["id"])

@app.route("/api/delete_quiz_with_id", methods=["POST"])
def delete_quiz_with_id():
    incoming = request.get_json()
    print(incoming)
    quiz_to_delete = Quiz.get_quiz_with_id(incoming["id"])
    if not quiz_to_delete:
        return jsonify(id=incoming["id"])
    db.session.delete(quiz_to_delete)
    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Quiz did not delete successfully"), 409
    return jsonify(id=incoming["id"])

@app.route("/api/assign_quiz_with_id", methods=["POST"])
def assign_quiz_with_id():
    incoming = request.get_json()
    print(incoming)
    quiz_to_assign = Quiz.get_quiz_with_id(incoming["id"])
    if not quiz_to_assign:
        return jsonify(id=incoming["id"])
    quiz_to_assign.assigned = '1'
    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Quiz did not assigned successfully"), 409
    return jsonify(id=incoming["id"])

@app.route("/api/student_get_quiz_list", methods=["POST"])
def student_get_quiz_list():
    incoming = request.get_json()
    print(incoming)
    quiz_list = Quiz.get_assigned_quiz_with_school(incoming["school"])
    result_list = []
    if quiz_list:
        for quiz in quiz_list:
            #3 status: new / finished / graded(grade)
            quiz_answer = Answer.get_answer_with_studentId_quizId(incoming["studentId"], quiz.id)
            graded = '0'
            choiceGrade = ''
            essayIdeaGrade = ''
            essayGrammaGrade = ''
            comments = ''
            if quiz_answer:
                graded = quiz_answer.graded
                if quiz_answer.choiceGrade: choiceGrade = quiz_answer.choiceGrade
                if quiz_answer.essayIdeaGrade: essayIdeaGrade = quiz_answer.essayIdeaGrade
                if quiz_answer.essayGrammaGrade: essayGrammaGrade = quiz_answer.essayGrammaGrade
                if quiz_answer.comments: comments = quiz_answer.comments
            result_list.append({ 'id': quiz.id, 'school': quiz.school, 'teacher': quiz.teacherId, 'title': quiz.title, 'graded': graded, 'choiceGrade': choiceGrade, 'essayIdeaGrade': essayIdeaGrade, 'essayGrammaGrade': essayGrammaGrade, 'comments': comments})
        #print(result_list)
    return jsonify(result_list)

@app.route("/api/teacher_get_quiz_with_id", methods=["POST"])
def teacher_get_quiz_with_id():
    incoming = request.get_json()
    print(incoming)
    id = incoming['id']
    quiz = Quiz.get_quiz_with_id(id)
    teacherId = ''
    school = ''
    title = ''
    article = ''
    choiceQ1 = ''
    choiceQ1A = ''
    choiceQ1B = ''
    choiceQ1C = ''
    choiceQ1D = ''
    choiceQ2 = ''
    choiceQ2A = ''
    choiceQ2B = ''
    choiceQ2C = ''
    choiceQ2D = ''
    choiceQ3 = ''
    choiceQ3A = ''
    choiceQ3B = ''
    choiceQ3C = ''
    choiceQ3D = ''
    choiceQ1Solution = ''
    choiceQ2Solution = ''
    choiceQ3Solution = ''
    essayQ1 = ''
    assigned = ''
    if quiz:
        teacherId = quiz.teacherId
        school = quiz.school
        title = quiz.title
        article = quiz.article
        choiceQ1 = quiz.choiceQ1
        choiceQ1A = quiz.choiceQ1A
        choiceQ1B = quiz.choiceQ1B
        choiceQ1C = quiz.choiceQ1C
        choiceQ1D = quiz.choiceQ1D
        choiceQ2 = quiz.choiceQ2
        choiceQ2A = quiz.choiceQ2A
        choiceQ2B = quiz.choiceQ2B
        choiceQ2C = quiz.choiceQ2C
        choiceQ2D = quiz.choiceQ2D
        choiceQ3 = quiz.choiceQ3
        choiceQ3A = quiz.choiceQ3A
        choiceQ3B = quiz.choiceQ3B
        choiceQ3C = quiz.choiceQ3C
        choiceQ3D = quiz.choiceQ3D
        choiceQ1Solution = quiz.choiceQ1Solution
        choiceQ2Solution = quiz.choiceQ2Solution
        choiceQ3Solution = quiz.choiceQ3Solution
        essayQ1 = quiz.essayQ1
        assigned = quiz.assigned
    quiz_result = {'id': id, 'teacherId':teacherId, 'school': school, 'title': title, 'article':article, 'choiceQ1': choiceQ1, 'choiceQ2': choiceQ2, 'choiceQ3': choiceQ3, 'essayQ1': essayQ1, 'choiceQ1A': choiceQ1A, 'choiceQ1B': choiceQ1B, 'choiceQ1C': choiceQ1C, 'choiceQ1D': choiceQ1D, 'choiceQ2A': choiceQ2A, 'choiceQ2B': choiceQ2B, 'choiceQ2C': choiceQ2C, 'choiceQ2D': choiceQ2D, 'choiceQ3A': choiceQ3A, 'choiceQ3B': choiceQ3B, 'choiceQ3C': choiceQ3C, 'choiceQ3D': choiceQ3D, 'choiceQ1Solution': choiceQ1Solution, 'choiceQ2Solution': choiceQ2Solution, 'choiceQ3Solution': choiceQ3Solution, 'assigned': assigned}
    return jsonify(quiz_result)

@app.route("/api/student_get_quiz_with_id", methods=["POST"])
def student_get_quiz_with_id():
    incoming = request.get_json()
    print(incoming)
    id = incoming['id']
    quiz = Quiz.get_quiz_with_id(id)
    teacherId = ''
    school = ''
    title = ''
    article = ''
    choiceQ1 = ''
    choiceQ1A = ''
    choiceQ1B = ''
    choiceQ1C = ''
    choiceQ1D = ''
    choiceQ2 = ''
    choiceQ2A = ''
    choiceQ2B = ''
    choiceQ2C = ''
    choiceQ2D = ''
    choiceQ3 = ''
    choiceQ3A = ''
    choiceQ3B = ''
    choiceQ3C = ''
    choiceQ3D = ''
    essayQ1 = ''
    assigned = ''
    if quiz:
        teacherId = quiz.teacherId
        school = quiz.school
        title = quiz.title
        article = quiz.article
        choiceQ1 = quiz.choiceQ1
        choiceQ1A = quiz.choiceQ1A
        choiceQ1B = quiz.choiceQ1B
        choiceQ1C = quiz.choiceQ1C
        choiceQ1D = quiz.choiceQ1D
        choiceQ2 = quiz.choiceQ2
        choiceQ2A = quiz.choiceQ2A
        choiceQ2B = quiz.choiceQ2B
        choiceQ2C = quiz.choiceQ2C
        choiceQ2D = quiz.choiceQ2D
        choiceQ3 = quiz.choiceQ3
        choiceQ3A = quiz.choiceQ3A
        choiceQ3B = quiz.choiceQ3B
        choiceQ3C = quiz.choiceQ3C
        choiceQ3D = quiz.choiceQ3D
        essayQ1 = quiz.essayQ1
        assigned = quiz.assigned
    quiz_result = {'id': id, 'teacherId':teacherId, 'school': school, 'title': title, 'article':article, 'choiceQ1': choiceQ1, 'choiceQ2': choiceQ2, 'choiceQ3': choiceQ3, 'essayQ1': essayQ1, 'choiceQ1A': choiceQ1A, 'choiceQ1B': choiceQ1B, 'choiceQ1C': choiceQ1C, 'choiceQ1D': choiceQ1D, 'choiceQ2A': choiceQ2A, 'choiceQ2B': choiceQ2B, 'choiceQ2C': choiceQ2C, 'choiceQ2D': choiceQ2D, 'choiceQ3A': choiceQ3A, 'choiceQ3B': choiceQ3B, 'choiceQ3C': choiceQ3C, 'choiceQ3D': choiceQ3D, 'assigned': assigned}
    return jsonify(quiz_result)

@app.route("/api/create_answer", methods=["POST"])
def create_answer():
    incoming = request.get_json()
    print(incoming)
    search_answer = Answer.get_answer_with_studentId_quizId(incoming['studentId'],incoming['quizId'])
    if search_answer:
        return jsonify(message="Answer with that student and title already exists"), 409
    answer = Answer(incoming['quizId'],incoming['teacherId'],incoming['studentId'],incoming['title'],incoming['choiceQ1Answer'],incoming['choiceQ2Answer'],incoming['choiceQ3Answer'],incoming['essayQ1Answer'])

    db.session.add(answer)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Answer with that student and title already exists"), 409

    return jsonify(
        id=answer.id,
        #token=generate_token(new_quiz)
    )

@app.route("/api/get_answer_to_grade_with_answerId_quizId", methods=["POST"])
def get_answer_to_grade_with_answerId_quizId():
    incoming = request.get_json()
    print(incoming)
    answer = Answer.get_answer_with_id(incoming["id"])
    quiz = Quiz.get_quiz_with_id(incoming['quizId'])
    if answer and quiz:
        if not answer.choiceGrade:
            choiceGrade = ""
        else:
            choiceGrade = answer.choiceGrade
        if not answer.essayIdeaGrade:
            essayIdeaGrade = ""
        else:
            essayIdeaGrade = answer.essayIdeaGrade
        if not answer.essayGrammaGrade:
            essayGrammaGrade = ""
        else:
            essayGrammaGrade = answer.essayGrammaGrade
        return jsonify({ 'id': answer.id, 'quizId': answer.quizId, 'studentId': answer.studentId, 'title': answer.title, 'choiceQ1Answer': answer.choiceQ1Answer,  'choiceQ2Answer': answer.choiceQ2Answer, 'choiceQ3Answer': answer.choiceQ3Answer, 'essayQ1Answer': answer.essayQ1Answer, 'graded': answer.graded, 'choiceGrade': choiceGrade, 'essayIdeaGrade': essayIdeaGrade, 'essayGrammaGrade': essayGrammaGrade, 'choiceQ1Solution': quiz.choiceQ1Solution, 'choiceQ2Solution': quiz.choiceQ2Solution, 'choiceQ3Solution': quiz.choiceQ3Solution})
        #print(result_list)
    return jsonify(id=incoming["id"])

@app.route("/api/teacher_grade_answer_with_answerId", methods=["POST"])
def teacher_grade_answer_with_answerId():
    incoming = request.get_json()
    print(incoming)
    answer = Answer.get_answer_with_id(incoming["id"])
    if not answer:
        return jsonify(message="Answer with that id does not exists"), 409
    answer.graded = 2
    answer.choiceGrade = incoming['choiceGrade']
    answer.essayIdeaGrade = incoming['essayIdeaGrade']
    answer.essayGrammaGrade = incoming['essayGrammaGrade']

    db.session.add(answer)
    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Save grade failed"), 409
    return jsonify(id=incoming["id"])

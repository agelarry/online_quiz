from index import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    firstName = db.Column(db.String(255))
    lastName = db.Column(db.String(255))
    school = db.Column(db.String(255))
    userType = db.Column(db.String(2))



    def __init__(self, email, password, firstName, lastName, school, userType):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)
        self.firstName = firstName
        self.lastName = lastName
        self.school = school
        self.userType = userType#teacher 0, student 1

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None

    @staticmethod
    def get_user_with_id(id):
        id = int(id)
        user = User.query.filter_by(id=id).first()
        if user:
            return user
        else:
            return None

    @staticmethod
    def get_student_with_school(school):
        user = User.query.filter_by(school=school, userType='1').all()
        if user:
            return user
        else:
            return None


#end

class Quiz(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    teacherId = db.Column(db.Integer(), db.ForeignKey('user.id'))
    school = db.Column(db.String(255))
    title = db.Column(db.String(255), unique=True)
    article = db.Column(db.String(4000))
    choiceQ1 = db.Column(db.String(1000))
    choiceQ2 = db.Column(db.String(1000))
    choiceQ3 = db.Column(db.String(1000))
    essayQ1 = db.Column(db.String(1000))
    choiceQ1A = db.Column(db.String(500))
    choiceQ1B = db.Column(db.String(500))
    choiceQ1C = db.Column(db.String(500))
    choiceQ1D = db.Column(db.String(500))
    choiceQ2A = db.Column(db.String(500))
    choiceQ2B = db.Column(db.String(500))
    choiceQ2C = db.Column(db.String(500))
    choiceQ2D = db.Column(db.String(500))
    choiceQ3A = db.Column(db.String(500))
    choiceQ3B = db.Column(db.String(500))
    choiceQ3C = db.Column(db.String(500))
    choiceQ3D = db.Column(db.String(500))
    choiceQ1Solution = db.Column(db.String(4))
    choiceQ2Solution = db.Column(db.String(4))
    choiceQ3Solution = db.Column(db.String(4))
    assigned = db.Column(db.String(1)) #0 not assigned, 1 is assigned



    def __init__(self, teacherId, school, title, article, choiceQ1, choiceQ2, choiceQ3, essayQ1, choiceQ1A, choiceQ1B, choiceQ1C, choiceQ1D, choiceQ2A, choiceQ2B, choiceQ2C, choiceQ2D, choiceQ3A, choiceQ3B, choiceQ3C, choiceQ3D, choiceQ1Solution, choiceQ2Solution, choiceQ3Solution, assigned=0):
        self.teacherId = teacherId
        self.school = school
        self.title = title
        self.active = True
        self.article = article
        self.choiceQ1 = choiceQ1
        self.choiceQ2 = choiceQ2
        self.choiceQ3 = choiceQ3
        self.essayQ1 = essayQ1
        self.choiceQ1A = choiceQ1A
        self.choiceQ1B = choiceQ1B
        self.choiceQ1C = choiceQ1C
        self.choiceQ1D = choiceQ1D
        self.choiceQ2A = choiceQ2A
        self.choiceQ2B = choiceQ2B
        self.choiceQ2C = choiceQ2C
        self.choiceQ2D = choiceQ2D
        self.choiceQ3A = choiceQ3A
        self.choiceQ3B = choiceQ3B
        self.choiceQ3C = choiceQ3C
        self.choiceQ3D = choiceQ3D
        self.choiceQ1Solution = choiceQ1Solution
        self.choiceQ2Solution = choiceQ2Solution
        self.choiceQ3Solution = choiceQ3Solution
        self.assigned = assigned

    @staticmethod
    def get_quiz_with_title(title):
        quiz = Quiz.query.filter_by(title=title).first()
        if quiz:
            return quiz
        else:
            return None

    @staticmethod
    def get_quiz_with_teacherId(teacherId):
        quiz_list = Quiz.query.filter_by(teacherId=teacherId).all()
        if quiz_list:
            return quiz_list
        else:
            return None

    @staticmethod
    def get_assigned_quiz_with_school(school):
        quiz_list = Quiz.query.filter_by(school=school, assigned='1').all()
        if quiz_list:
            return quiz_list
        else:
            return None

    @staticmethod
    def get_quiz_with_id(id):
        quiz = Quiz.query.filter_by(id=id).first()
        if quiz:
            return quiz
        else:
            return None

#end

class Answer(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    quizId = db.Column(db.Integer(), db.ForeignKey('quiz.id'))
    teacherId = db.Column(db.Integer(), db.ForeignKey('user.id'))
    studentId = db.Column(db.Integer(), db.ForeignKey('user.id'))
    title = db.Column(db.String(255))
    choiceQ1Answer = db.Column(db.String(2))
    choiceQ2Answer = db.Column(db.String(2))
    choiceQ3Answer = db.Column(db.String(2))
    essayQ1Answer = db.Column(db.String(1000))
    graded = db.Column(db.String(1))#1 not graded, 2 graded
    choiceGrade = db.Column(db.String(2))
    essayIdeaGrade = db.Column(db.String(2))
    essayGrammaGrade = db.Column(db.String(2))
    comments = db.Column(db.String(255))



    def __init__(self, quizId, teacherId, studentId, title, choiceQ1Answer, choiceQ2Answer, choiceQ3Answer, essayQ1Answer, graded=1, choiceGrade=None, essayIdeaGrade=None, essayGrammaGrade=None, comments=None):
        self.quizId = quizId
        self.teacherId = teacherId
        self.studentId = studentId
        self.title = title
        self.choiceQ1Answer = choiceQ1Answer
        self.choiceQ2Answer = choiceQ2Answer
        self.choiceQ3Answer = choiceQ3Answer
        self.essayQ1Answer = essayQ1Answer
        self.graded = graded
        self.choiceGrade = choiceGrade
        self.essayIdeaGrade = essayIdeaGrade
        self.essayGrammaGrade = essayGrammaGrade
        self.comments = comments

    @staticmethod
    def get_answer_with_teacherId(teacherId):
        answer = Answer.query.filter_by(teacherId=teacherId).all()
        if answer:
            return answer
        else:
            return None    \

    @staticmethod
    def get_answer_with_teacherId_quizId(teacherId, quizId):
        answer = Answer.query.filter_by(teacherId=teacherId,quizId=quizId).all()
        if answer:
            return answer
        else:
            return None\

    @staticmethod
    def get_answer_with_studentId_quizId(studentId,quizId):
        answer = Answer.query.filter_by(studentId=studentId,quizId=quizId).first()
        if answer:
            return answer
        else:
            return None    \

    @staticmethod
    def get_answer_with_id(id):
        answer = Answer.query.filter_by(id=id).first()
        if answer:
            return answer
        else:
            return None




#end

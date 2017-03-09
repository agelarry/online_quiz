# online_quiz
online quiz system, teacher create, assign, grade quiz; student take quiz

Note: if the manage quiz view is not generated correctly, ie. "Loading data" message is shown, it probably the browser cache issue, if it does not show the list after a few seconds, please click HOME button on top right then click the top left navi menu to navigate again to the view you wanted to browse.

[![login.jpg](https://s25.postimg.org/cxfp16zz3/login.jpg)](https://postimg.org/image/i8ullwm1n/)

Describtion of the online quiz system:

There are two role types to choose. Teacher and student. These are choosen when creating a user. When register a user, user should input email address, password, first name, last name, pick a school he or she belongs to, pick up a role type.

Teacher can grade, view, delete, edit, assign quizzes, grade students' answers and view students list in the same school with their grade for each quiz and each student's total grade.

Student can take quizzes and view their grade.

Following is a brief screenshot intruduction:

Login as teacher:

Click the top left navi button and navigate to create Quiz / Manage Quiz

[![create1.jpg](https://s25.postimg.org/q2v77atun/create1.jpg)](https://postimg.org/image/9rv3azhcr/)

The view of Create Quiz. Teacher can type in title and article to read first. Then click next to generate questions and pick solutions for choice problem. There are two types of problem, choice problem and essay problem. User can choice 0-3 choice problems and 0-1 essay problems.

[![create2.jpg](https://s25.postimg.org/u0igwpgnz/create2.jpg)](https://postimg.org/image/9t514ej6j/)

After all the data is finished for this quiz, teacher can create a new quiz or return to manage quiz view.

[![create3.jpg](https://s25.postimg.org/byzbywmn3/create3.jpg)](https://postimg.org/image/5y1n1u00r/)

This is the view of teacher manage quiz. There are three tabs, MY ACTIVITY, GRADE QUIZ, REPORTS.

Under the MY ACTIVITY Tab, Teacher can select a quiz by click the checkbox of it. There are four actions for teacher here. 
1.View: Teacher can preview the quiz like a student taking the quiz. But teacher's answer will not be sent to the server. It is just used for a teacher's preview so it will not save in the database.
2.Edit: Teacher can edit a quiz, change the title, article, problems and so on.
3.Delete: Teacher can delete selected quiz.
4.Assign: Teacher can assign selected quiz. Then the status will change from NO to YES, then students in the same school will be able to see the quiz assigned to them.

[![manage1.jpg](https://s25.postimg.org/l9bg2fxcv/manage1.jpg)](https://postimg.org/image/teti0llln/)

Under the GRADE QUIZ Tab, Teacher will see the list of all the answers. Teacher can select an answer and click GRADE button to grade it.

[![manage2.jpg](https://s25.postimg.org/gotv1931b/manage2.jpg)](https://postimg.org/image/3xfouqt97/)

The grade view is below, teacher will be able to see the answer of choice problem and solution of the quiz, this part will be auto graded. Teacher can see the essay answer and manually give the essay idea grade and essay grammar grade by pick a number from 0-5.

[![grade1.jpg](https://s25.postimg.org/6c2z1fk4f/grade1.jpg)](https://postimg.org/image/uftqpq2l7/)

Under the REPORTS Tab, teacher will get a list of students and their id, name, quiz score if graded otherwise quiz status like unsloved/ungraded, and the total grade.

[![manage3.jpg](https://s25.postimg.org/3ly8hzctb/manage3.jpg)](https://postimg.org/image/5qilj2efv/)



Login as student:

Click the top left navi menu to manage quiz view. There are two tabs, MY ACTIVITY and REPORTS.
Under the MY ACTIVITY tab, student can pick a NEW (means unsolbed) quiz to take. If the quiz is grade, the grade will be shown, otherwise, status will be shown.

[![manage5.jpg](https://s25.postimg.org/kp10dhti7/manage5.jpg)](https://postimg.org/image/7kvg0t1gb/)

Following is the take quiz view. Student should pick choice problem answer and type in essay answer.

[![take1.jpg](https://s25.postimg.org/svt052jkv/take1.jpg)](https://postimg.org/image/nx5hqjfrv/)
[![take2.jpg](https://s25.postimg.org/hkqcgpcpr/take2.jpg)](https://postimg.org/image/s7k5m4kuz/)
[![take3.jpg](https://s25.postimg.org/g6ypledgf/take3.jpg)](https://postimg.org/image/zc1yv5s4b/)

Under the REPORTS tab, student will see a list of quiz he/she has. Also the status or grade if it is graded by teacher. Then a total grade as well.

[![manage4.jpg](https://s25.postimg.org/a0x9enjj3/manage4.jpg)](https://postimg.org/image/76u417hcr/)




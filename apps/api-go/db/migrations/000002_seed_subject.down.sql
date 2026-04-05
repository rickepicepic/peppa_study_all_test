DELETE qo
FROM question_options qo
JOIN quiz_questions qq ON qq.id = qo.question_id
WHERE qq.question_key = 'q1';

DELETE FROM quiz_questions WHERE question_key = 'q1';
DELETE FROM quizzes WHERE quiz_key = 'tcp-handshake-01';
DELETE FROM subjects WHERE code = 'network';

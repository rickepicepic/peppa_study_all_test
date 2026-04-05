INSERT INTO subjects (code, name) VALUES ('network', '计算机网络');

INSERT INTO quizzes (quiz_key, subject_id, title)
SELECT 'tcp-handshake-01', s.id, 'TCP 三次握手基础测验'
FROM subjects s
WHERE s.code = 'network';

INSERT INTO quiz_questions (quiz_id, question_key, question_type, prompt, explanation, correct_answers)
SELECT q.id, 'q1', 'single', 'TCP 三次握手中，第二次报文通常包含什么标志位？', '服务端回复 SYN + ACK。', JSON_ARRAY('B')
FROM quizzes q
WHERE q.quiz_key = 'tcp-handshake-01';

INSERT INTO question_options (question_id, option_key, option_text, sort_order)
SELECT qq.id, 'A', 'SYN', 1 FROM quiz_questions qq WHERE qq.question_key = 'q1';

INSERT INTO question_options (question_id, option_key, option_text, sort_order)
SELECT qq.id, 'B', 'SYN+ACK', 2 FROM quiz_questions qq WHERE qq.question_key = 'q1';

INSERT INTO question_options (question_id, option_key, option_text, sort_order)
SELECT qq.id, 'C', 'ACK', 3 FROM quiz_questions qq WHERE qq.question_key = 'q1';

CREATE TABLE subjects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quizzes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  quiz_key VARCHAR(128) NOT NULL UNIQUE,
  subject_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quizzes_subject FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE quiz_questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  quiz_id BIGINT NOT NULL,
  question_key VARCHAR(128) NOT NULL,
  question_type ENUM('single', 'multiple', 'boolean') NOT NULL,
  prompt TEXT NOT NULL,
  explanation TEXT NOT NULL,
  correct_answers JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_quiz_question_key (quiz_id, question_key),
  CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE question_options (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question_id BIGINT NOT NULL,
  option_key VARCHAR(16) NOT NULL,
  option_text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_question_option_key (question_id, option_key),
  CONSTRAINT fk_options_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
);

CREATE TABLE user_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  subject_id BIGINT NOT NULL,
  node_id VARCHAR(255) NOT NULL,
  completed TINYINT(1) NOT NULL,
  updated_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_node (user_id, subject_id, node_id),
  CONSTRAINT fk_progress_subject FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE user_quiz_attempts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  quiz_id BIGINT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  correct_count INT NOT NULL,
  submitted_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE attempt_answers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  attempt_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  selected_answers JSON NOT NULL,
  is_correct TINYINT(1) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_answer_attempt FOREIGN KEY (attempt_id) REFERENCES user_quiz_attempts(id),
  CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
);

CREATE TABLE user_wrong_questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  subject_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  wrong_count INT NOT NULL DEFAULT 1,
  last_wrong_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_wrong_question (user_id, subject_id, question_id),
  CONSTRAINT fk_wrong_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
  CONSTRAINT fk_wrong_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
);

CREATE TABLE progress_merge_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  merge_token VARCHAR(128) NOT NULL,
  result_json JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_merge_token (user_id, merge_token)
);

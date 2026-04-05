package repo

import "database/sql"

type mySQLQuizRepo struct {
	db *sql.DB
}

func NewMySQLQuizRepo(db *sql.DB) QuizRepo {
	return &mySQLQuizRepo{db: db}
}

func (r *mySQLQuizRepo) StoreAttempt(userID int64, quizID string) {
	_, _ = r.db.Exec(
		`INSERT INTO user_quiz_attempts (user_id, quiz_id, score, total, correct_count, submitted_at)
		 SELECT ?, q.id, 0, 0, 0, NOW()
		 FROM quizzes q
		 WHERE q.quiz_key = ?`,
		userID,
		quizID,
	)
}

func (r *mySQLQuizRepo) UpsertWrongQuestion(userID int64, subject, questionID string) {
	_, _ = r.db.Exec(
		`INSERT INTO user_wrong_questions (user_id, subject_id, question_id, wrong_count, last_wrong_at)
		 SELECT ?, s.id, qq.id, 1, NOW()
		 FROM subjects s
		 JOIN quiz_questions qq ON qq.question_key = ?
		 WHERE s.code = ?
		 ON DUPLICATE KEY UPDATE
		 wrong_count = wrong_count + 1,
		 last_wrong_at = VALUES(last_wrong_at)`,
		userID,
		questionID,
		subject,
	)
}

func (r *mySQLQuizRepo) AttemptCount(userID int64) int {
	var count int
	if err := r.db.QueryRow("SELECT COUNT(1) FROM user_quiz_attempts WHERE user_id = ?", userID).Scan(&count); err != nil {
		return 0
	}
	return count
}

func (r *mySQLQuizRepo) WrongQuestionCount(userID int64) int {
	var count int
	if err := r.db.QueryRow("SELECT COUNT(1) FROM user_wrong_questions WHERE user_id = ?", userID).Scan(&count); err != nil {
		return 0
	}
	return count
}

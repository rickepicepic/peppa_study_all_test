package model

type QuizSubmitAnswer struct {
	QuestionID string   `json:"questionId"`
	Selected   []string `json:"selected"`
}

type QuizSubmitRequest struct {
	QuizID  string             `json:"quizId"`
	Answers []QuizSubmitAnswer `json:"answers"`
	Subject string             `json:"subject"`
}

type QuizResultDetail struct {
	QuestionID string   `json:"questionId"`
	Selected   []string `json:"selected"`
	Correct    []string `json:"correct"`
	IsCorrect  bool     `json:"isCorrect"`
}

type QuizSubmitResponse struct {
	Score                int                `json:"score"`
	CorrectCount         int                `json:"correctCount"`
	Total                int                `json:"total"`
	Details              []QuizResultDetail `json:"details"`
	AttemptStored        bool               `json:"attemptStored"`
	WrongQuestionsStored int                `json:"wrongQuestionsStored"`
}

type QuizQuestion struct {
	QuestionID string
	Correct    []string
}

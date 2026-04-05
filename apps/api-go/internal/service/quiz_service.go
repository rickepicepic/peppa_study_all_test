package service

import (
	"sort"

	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/repo"
)

type QuizService struct {
	repo         repo.QuizRepo
	quizBankByID map[string][]model.QuizQuestion
}

func NewQuizService(r repo.QuizRepo) *QuizService {
	return &QuizService{
		repo: r,
		quizBankByID: map[string][]model.QuizQuestion{
			"tcp-handshake-01": {
				{QuestionID: "q1", Correct: []string{"B"}},
			},
		},
	}
}

func (s *QuizService) Submit(userID int64, req model.QuizSubmitRequest) model.QuizSubmitResponse {
	questions := s.quizBankByID[req.QuizID]
	answerByQuestion := map[string][]string{}
	for _, a := range req.Answers {
		answerByQuestion[a.QuestionID] = a.Selected
	}

	details := make([]model.QuizResultDetail, 0, len(questions))
	correctCount := 0
	wrongStored := 0

	for _, q := range questions {
		selected := answerByQuestion[q.QuestionID]
		isCorrect := sameAnswers(q.Correct, selected)
		if isCorrect {
			correctCount++
		} else {
			s.repo.UpsertWrongQuestion(userID, req.Subject, q.QuestionID)
			wrongStored++
		}
		details = append(details, model.QuizResultDetail{
			QuestionID: q.QuestionID,
			Selected:   selected,
			Correct:    q.Correct,
			IsCorrect:  isCorrect,
		})
	}

	total := len(questions)
	score := 0
	if total > 0 {
		score = (correctCount * 100) / total
	}
	s.repo.StoreAttempt(userID, req.QuizID)

	return model.QuizSubmitResponse{
		Score:                score,
		CorrectCount:         correctCount,
		Total:                total,
		Details:              details,
		AttemptStored:        s.repo.AttemptCount(userID) > 0,
		WrongQuestionsStored: s.repo.WrongQuestionCount(userID),
	}
}

func sameAnswers(expected, actual []string) bool {
	e := append([]string(nil), expected...)
	a := append([]string(nil), actual...)
	sort.Strings(e)
	sort.Strings(a)
	if len(e) != len(a) {
		return false
	}
	for i := range e {
		if e[i] != a[i] {
			return false
		}
	}
	return true
}

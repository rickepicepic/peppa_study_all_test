package repo

import "sync"

type QuizRepo interface {
	StoreAttempt(userID int64, quizID string)
	UpsertWrongQuestion(userID int64, subject, questionID string)
	AttemptCount(userID int64) int
	WrongQuestionCount(userID int64) int
}

type memoryQuizRepo struct {
	mu       sync.RWMutex
	attempts map[int64][]string
	wrongQs  map[int64]map[string]int
}

func NewMemoryQuizRepo() QuizRepo {
	return &memoryQuizRepo{
		attempts: map[int64][]string{},
		wrongQs:  map[int64]map[string]int{},
	}
}

func (r *memoryQuizRepo) StoreAttempt(userID int64, quizID string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.attempts[userID] = append(r.attempts[userID], quizID)
}

func (r *memoryQuizRepo) UpsertWrongQuestion(userID int64, _ string, questionID string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.wrongQs[userID]; !ok {
		r.wrongQs[userID] = map[string]int{}
	}
	r.wrongQs[userID][questionID]++
}

func (r *memoryQuizRepo) AttemptCount(userID int64) int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.attempts[userID])
}

func (r *memoryQuizRepo) WrongQuestionCount(userID int64) int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.wrongQs[userID])
}

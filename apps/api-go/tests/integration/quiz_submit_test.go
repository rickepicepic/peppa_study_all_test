package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/config"
	httpserver "github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/http"
)

func TestSubmitQuizWritesAttemptAndWrongQuestions(t *testing.T) {
	cfg := config.Config{HTTPAddr: ":8080", AuthEnabled: false, JWTSecret: "test-secret"}
	r := httpserver.NewRouter(httpserver.NewDependencies(cfg))
	body := []byte(`{"quizId":"tcp-handshake-01","subject":"network","answers":[{"questionId":"q1","selected":["A"]}]}`)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/quizzes/submit", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()
	r.ServeHTTP(res, req)
	require.Equal(t, http.StatusOK, res.Code)

	var payload map[string]any
	err := json.Unmarshal(res.Body.Bytes(), &payload)
	require.NoError(t, err)
	require.Contains(t, payload, "score")
	require.EqualValues(t, true, payload["attemptStored"])
	require.EqualValues(t, float64(1), payload["wrongQuestionsStored"])
}

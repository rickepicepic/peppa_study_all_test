package integration

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/config"
	httpserver "github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/http"
)

func TestSyncProgressIdempotentByMergeToken(t *testing.T) {
	cfg := config.Config{HTTPAddr: ":8080", AuthEnabled: false, JWTSecret: "test-secret"}
	r := httpserver.NewRouter(httpserver.NewDependencies(cfg))
	body := []byte(`{"mergeToken":"token-1","subject":"network","items":[{"nodeId":"network/system/tcp","completed":true,"updatedAt":"2026-04-05T12:00:00Z"}]}`)

	req1 := httptest.NewRequest(http.MethodPost, "/api/v1/progress/sync", bytes.NewReader(body))
	req1.Header.Set("Content-Type", "application/json")
	res1 := httptest.NewRecorder()
	r.ServeHTTP(res1, req1)
	require.Equal(t, http.StatusOK, res1.Code)

	req2 := httptest.NewRequest(http.MethodPost, "/api/v1/progress/sync", bytes.NewReader(body))
	req2.Header.Set("Content-Type", "application/json")
	res2 := httptest.NewRecorder()
	r.ServeHTTP(res2, req2)
	require.Equal(t, http.StatusOK, res2.Code)

	body1, err := io.ReadAll(res1.Body)
	require.NoError(t, err)
	body2, err := io.ReadAll(res2.Body)
	require.NoError(t, err)
	require.Equal(t, string(body1), string(body2))
}

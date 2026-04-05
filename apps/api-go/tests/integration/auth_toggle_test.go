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

var guestPayload = []byte(`{"mergeToken":"guest-token","subject":"network","items":[{"nodeId":"network/system/tcp","completed":true,"updatedAt":"2026-04-05T12:00:00Z"}]}`)

func TestAuthToggleOffAllowsGuestSync(t *testing.T) {
	cfg := config.Config{HTTPAddr: ":8080", AuthEnabled: false, JWTSecret: "test-secret"}
	r := httpserver.NewRouter(httpserver.NewDependencies(cfg))

	req := httptest.NewRequest(http.MethodPost, "/api/v1/progress/sync", bytes.NewReader(guestPayload))
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()
	r.ServeHTTP(res, req)
	require.Equal(t, http.StatusOK, res.Code)
}

func TestAuthToggleOnRequiresToken(t *testing.T) {
	cfg := config.Config{HTTPAddr: ":8080", AuthEnabled: true, JWTSecret: "test-secret"}
	r := httpserver.NewRouter(httpserver.NewDependencies(cfg))

	req := httptest.NewRequest(http.MethodPost, "/api/v1/progress/sync", bytes.NewReader(guestPayload))
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()
	r.ServeHTTP(res, req)
	require.Equal(t, http.StatusUnauthorized, res.Code)
}

func TestAuthToggleOnAllowsBearerToken(t *testing.T) {
	cfg := config.Config{HTTPAddr: ":8080", AuthEnabled: true, JWTSecret: "test-secret"}
	r := httpserver.NewRouter(httpserver.NewDependencies(cfg))

	loginBody := []byte(`{"userId":42}`)
	loginReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")
	loginRes := httptest.NewRecorder()
	r.ServeHTTP(loginRes, loginReq)
	require.Equal(t, http.StatusOK, loginRes.Code)

	var loginPayload map[string]string
	err := json.Unmarshal(loginRes.Body.Bytes(), &loginPayload)
	require.NoError(t, err)
	token := loginPayload["token"]
	require.NotEmpty(t, token)

	syncReq := httptest.NewRequest(http.MethodPost, "/api/v1/progress/sync", bytes.NewReader(guestPayload))
	syncReq.Header.Set("Content-Type", "application/json")
	syncReq.Header.Set("Authorization", "Bearer "+token)
	syncRes := httptest.NewRecorder()
	r.ServeHTTP(syncRes, syncReq)
	require.Equal(t, http.StatusOK, syncRes.Code)
}

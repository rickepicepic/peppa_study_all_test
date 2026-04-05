package httpserver

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/config"
)

func TestHealthz(t *testing.T) {
	r := NewRouter(nil)
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusOK, rec.Code)
}

func TestCORSAllowsConfiguredOrigin(t *testing.T) {
	cfg := config.Config{
		HTTPAddr:    ":8080",
		AuthEnabled: false,
		JWTSecret:   "test-secret",
		CORSOrigins: "https://example.github.io",
	}
	r := NewRouter(NewDependencies(cfg))
	req := httptest.NewRequest(http.MethodOptions, "/api/v1/progress/sync", nil)
	req.Header.Set("Origin", "https://example.github.io")
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusNoContent, rec.Code)
	require.Equal(t, "https://example.github.io", rec.Header().Get("Access-Control-Allow-Origin"))
}

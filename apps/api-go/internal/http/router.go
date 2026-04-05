package httpserver

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/auth"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/config"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/db"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/http/handlers"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/http/middleware"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/repo"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/service"
)

type Dependencies struct {
	ProgressHandler *handlers.ProgressHandler
	QuizHandler     *handlers.QuizHandler
	AuthHandler     *handlers.AuthHandler
	AuthEnabled     bool
	JWTManager      *auth.JWTManager
	StorageMode     string
	CORSOrigins     string
}

func NewDependencies(cfg config.Config) *Dependencies {
	progressRepo := repo.NewMemoryProgressRepo()
	quizRepo := repo.NewMemoryQuizRepo()
	storageMode := "memory"
	if cfg.MySQLDSN != "" {
		mySQLDB, err := db.OpenMySQL(cfg.MySQLDSN)
		if err != nil {
			log.Printf("api-go: mysql unavailable, fallback to memory repo: %v", err)
		} else {
			progressRepo = repo.NewMySQLProgressRepo(mySQLDB)
			quizRepo = repo.NewMySQLQuizRepo(mySQLDB)
			storageMode = "mysql"
		}
	}
	progressService := service.NewProgressService(progressRepo)
	quizService := service.NewQuizService(quizRepo)
	jwtManager := auth.NewJWTManager(cfg.JWTSecret)
	return &Dependencies{
		ProgressHandler: handlers.NewProgressHandler(progressService),
		QuizHandler:     handlers.NewQuizHandler(quizService),
		AuthHandler:     handlers.NewAuthHandler(jwtManager),
		AuthEnabled:     cfg.AuthEnabled,
		JWTManager:      jwtManager,
		StorageMode:     storageMode,
		CORSOrigins:     cfg.CORSOrigins,
	}
}

func NewRouter(deps *Dependencies) *gin.Engine {
	if deps == nil {
		deps = NewDependencies(config.Load())
	}
	r := gin.New()
	r.Use(corsMiddleware(splitCSV(deps.CORSOrigins)))
	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "storageMode": deps.StorageMode})
	})

	apiPublic := r.Group("/api/v1/auth")
	apiPublic.POST("/login", deps.AuthHandler.Login)

	api := r.Group("/api/v1")
	api.Use(middleware.WithAuthToggle(deps.AuthEnabled, deps.JWTManager))
	api.POST("/progress/sync", deps.ProgressHandler.Sync)
	api.POST("/quizzes/submit", deps.QuizHandler.Submit)

	return r
}

func splitCSV(input string) []string {
	parts := strings.Split(input, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}

func corsMiddleware(allowedOrigins []string) gin.HandlerFunc {
	allowed := map[string]bool{}
	for _, origin := range allowedOrigins {
		allowed[origin] = true
	}

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" && allowed[origin] {
			headers := c.Writer.Header()
			headers.Set("Access-Control-Allow-Origin", origin)
			headers.Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
			headers.Set("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization")
			headers.Set("Access-Control-Allow-Credentials", "true")
			headers.Set("Vary", "Origin")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/auth"
)

const CtxUserID = "userID"

func WithAuthToggle(enabled bool, jwtManager *auth.JWTManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !enabled {
			c.Set(CtxUserID, int64(1))
			c.Next()
			return
		}

		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		token := strings.TrimPrefix(header, "Bearer ")
		userID, err := jwtManager.ParseToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid bearer token"})
			return
		}
		c.Set(CtxUserID, userID)
		c.Next()
	}
}

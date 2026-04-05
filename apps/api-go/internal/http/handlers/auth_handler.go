package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/auth"
)

type AuthHandler struct {
	jwtManager *auth.JWTManager
}

type loginRequest struct {
	UserID int64 `json:"userId"`
}

func NewAuthHandler(jwtManager *auth.JWTManager) *AuthHandler {
	return &AuthHandler{jwtManager: jwtManager}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	if req.UserID == 0 {
		req.UserID = 1
	}
	token, err := h.jwtManager.IssueToken(req.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

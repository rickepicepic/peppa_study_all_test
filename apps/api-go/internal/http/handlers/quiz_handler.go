package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/http/middleware"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/service"
)

type QuizHandler struct {
	service *service.QuizService
}

func NewQuizHandler(s *service.QuizService) *QuizHandler {
	return &QuizHandler{service: s}
}

func (h *QuizHandler) Submit(c *gin.Context) {
	var req model.QuizSubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	if req.QuizID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "quizId is required"})
		return
	}
	if req.Subject == "" {
		req.Subject = "network"
	}
	userID, ok := c.Get(middleware.CtxUserID)
	if !ok {
		userID = int64(1)
	}
	res := h.service.Submit(userID.(int64), req)
	c.JSON(http.StatusOK, res)
}

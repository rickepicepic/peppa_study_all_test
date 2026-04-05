package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/http/middleware"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/service"
)

type ProgressHandler struct {
	service *service.ProgressService
}

func NewProgressHandler(s *service.ProgressService) *ProgressHandler {
	return &ProgressHandler{service: s}
}

func (h *ProgressHandler) Sync(c *gin.Context) {
	var req model.ProgressSyncRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	if req.MergeToken == "" || req.Subject == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mergeToken and subject are required"})
		return
	}
	userID, ok := c.Get(middleware.CtxUserID)
	if !ok {
		userID = int64(1)
	}
	res, err := h.service.Sync(userID.(int64), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "sync failed"})
		return
	}
	c.JSON(http.StatusOK, res)
}

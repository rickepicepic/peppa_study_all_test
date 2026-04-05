package service

import (
	"time"

	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/repo"
)

type ProgressService struct {
	repo repo.ProgressRepo
}

func NewProgressService(r repo.ProgressRepo) *ProgressService {
	return &ProgressService{repo: r}
}

func (s *ProgressService) Sync(userID int64, req model.ProgressSyncRequest) (model.ProgressSyncResponse, error) {
	if cached, ok := s.repo.GetMergeResult(userID, req.MergeToken); ok {
		return cached, nil
	}

	merged := make([]model.ProgressNode, 0, len(req.Items))
	for _, item := range req.Items {
		localTime, err := time.Parse(time.RFC3339, item.UpdatedAt)
		if err != nil {
			localTime = time.Now().UTC()
		}
		local := model.ProgressNode{
			NodeID:    item.NodeID,
			Completed: item.Completed,
			UpdatedAt: localTime,
		}

		cloud, ok := s.repo.GetNode(userID, req.Subject, item.NodeID)
		if !ok {
			cloud = model.ProgressNode{NodeID: item.NodeID, Completed: false, UpdatedAt: time.Time{}}
		}
		finalNode := MergeNode(cloud, local)
		s.repo.UpsertNode(userID, req.Subject, finalNode)
		merged = append(merged, finalNode)
	}

	res := model.ProgressSyncResponse{Merged: len(merged), Items: merged}
	s.repo.SaveMergeResult(userID, req.MergeToken, res)
	return res, nil
}

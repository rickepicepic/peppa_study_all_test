package repo

import (
	"sync"

	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"
)

type ProgressRepo interface {
	GetMergeResult(userID int64, token string) (model.ProgressSyncResponse, bool)
	SaveMergeResult(userID int64, token string, result model.ProgressSyncResponse)
	GetNode(userID int64, subject, nodeID string) (model.ProgressNode, bool)
	UpsertNode(userID int64, subject string, node model.ProgressNode)
}

type memoryProgressRepo struct {
	mu          sync.RWMutex
	mergeResult map[int64]map[string]model.ProgressSyncResponse
	nodes       map[int64]map[string]map[string]model.ProgressNode
}

func NewMemoryProgressRepo() ProgressRepo {
	return &memoryProgressRepo{
		mergeResult: map[int64]map[string]model.ProgressSyncResponse{},
		nodes:       map[int64]map[string]map[string]model.ProgressNode{},
	}
}

func (r *memoryProgressRepo) GetMergeResult(userID int64, token string) (model.ProgressSyncResponse, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if _, ok := r.mergeResult[userID]; !ok {
		return model.ProgressSyncResponse{}, false
	}
	res, ok := r.mergeResult[userID][token]
	return res, ok
}

func (r *memoryProgressRepo) SaveMergeResult(userID int64, token string, result model.ProgressSyncResponse) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.mergeResult[userID]; !ok {
		r.mergeResult[userID] = map[string]model.ProgressSyncResponse{}
	}
	r.mergeResult[userID][token] = result
}

func (r *memoryProgressRepo) GetNode(userID int64, subject, nodeID string) (model.ProgressNode, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	subjectNodes, ok := r.nodes[userID][subject]
	if !ok {
		return model.ProgressNode{}, false
	}
	node, ok := subjectNodes[nodeID]
	return node, ok
}

func (r *memoryProgressRepo) UpsertNode(userID int64, subject string, node model.ProgressNode) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.nodes[userID]; !ok {
		r.nodes[userID] = map[string]map[string]model.ProgressNode{}
	}
	if _, ok := r.nodes[userID][subject]; !ok {
		r.nodes[userID][subject] = map[string]model.ProgressNode{}
	}
	r.nodes[userID][subject][node.NodeID] = node
}

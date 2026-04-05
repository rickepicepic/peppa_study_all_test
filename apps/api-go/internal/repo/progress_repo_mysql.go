package repo

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"
)

type mySQLProgressRepo struct {
	db *sql.DB
}

func NewMySQLProgressRepo(db *sql.DB) ProgressRepo {
	return &mySQLProgressRepo{db: db}
}

func (r *mySQLProgressRepo) GetMergeResult(userID int64, token string) (model.ProgressSyncResponse, bool) {
	var raw []byte
	err := r.db.QueryRow(
		"SELECT result_json FROM progress_merge_logs WHERE user_id = ? AND merge_token = ? LIMIT 1",
		userID,
		token,
	).Scan(&raw)
	if err != nil {
		return model.ProgressSyncResponse{}, false
	}
	var result model.ProgressSyncResponse
	if err := json.Unmarshal(raw, &result); err != nil {
		return model.ProgressSyncResponse{}, false
	}
	return result, true
}

func (r *mySQLProgressRepo) SaveMergeResult(userID int64, token string, result model.ProgressSyncResponse) {
	raw, err := json.Marshal(result)
	if err != nil {
		return
	}
	_, _ = r.db.Exec(
		`INSERT INTO progress_merge_logs (user_id, merge_token, result_json)
		 VALUES (?, ?, ?)
		 ON DUPLICATE KEY UPDATE result_json = VALUES(result_json)`,
		userID,
		token,
		raw,
	)
}

func (r *mySQLProgressRepo) GetNode(userID int64, subject, nodeID string) (model.ProgressNode, bool) {
	var completed bool
	var updatedAt time.Time
	err := r.db.QueryRow(
		`SELECT up.completed, up.updated_at
		 FROM user_progress up
		 JOIN subjects s ON s.id = up.subject_id
		 WHERE up.user_id = ? AND s.code = ? AND up.node_id = ?
		 LIMIT 1`,
		userID,
		subject,
		nodeID,
	).Scan(&completed, &updatedAt)
	if err != nil {
		return model.ProgressNode{}, false
	}
	return model.ProgressNode{NodeID: nodeID, Completed: completed, UpdatedAt: updatedAt}, true
}

func (r *mySQLProgressRepo) UpsertNode(userID int64, subject string, node model.ProgressNode) {
	_, _ = r.db.Exec(
		`INSERT INTO user_progress (user_id, subject_id, node_id, completed, updated_at)
		 SELECT ?, s.id, ?, ?, ?
		 FROM subjects s
		 WHERE s.code = ?
		 ON DUPLICATE KEY UPDATE
		 completed = VALUES(completed),
		 updated_at = VALUES(updated_at)`,
		userID,
		node.NodeID,
		node.Completed,
		node.UpdatedAt,
		subject,
	)
}

package model

import "time"

type ProgressNode struct {
	NodeID    string
	Completed bool
	UpdatedAt time.Time
}

type ProgressSyncItem struct {
	NodeID    string `json:"nodeId"`
	Completed bool   `json:"completed"`
	UpdatedAt string `json:"updatedAt"`
}

type ProgressSyncRequest struct {
	MergeToken string             `json:"mergeToken"`
	Subject    string             `json:"subject"`
	Items      []ProgressSyncItem `json:"items"`
}

type ProgressSyncResponse struct {
	Merged int            `json:"merged"`
	Items  []ProgressNode `json:"items"`
}

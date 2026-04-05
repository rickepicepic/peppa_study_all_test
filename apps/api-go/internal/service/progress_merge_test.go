package service

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"
)

func TestMergeProgressNoRollback(t *testing.T) {
	cloud := model.ProgressNode{
		NodeID:    "network/system/tcp",
		Completed: true,
		UpdatedAt: time.Date(2026, 4, 5, 10, 0, 0, 0, time.UTC),
	}
	local := model.ProgressNode{
		NodeID:    "network/system/tcp",
		Completed: false,
		UpdatedAt: time.Date(2026, 4, 5, 11, 0, 0, 0, time.UTC),
	}

	merged := MergeNode(cloud, local)
	require.True(t, merged.Completed)
}

func TestMergeProgressTimestampPriority(t *testing.T) {
	cloud := model.ProgressNode{
		NodeID:    "network/system/ip",
		Completed: false,
		UpdatedAt: time.Date(2026, 4, 5, 10, 0, 0, 0, time.UTC),
	}
	local := model.ProgressNode{
		NodeID:    "network/system/ip",
		Completed: true,
		UpdatedAt: time.Date(2026, 4, 5, 11, 0, 0, 0, time.UTC),
	}

	merged := MergeNode(cloud, local)
	require.Equal(t, local.UpdatedAt, merged.UpdatedAt)
	require.True(t, merged.Completed)
}

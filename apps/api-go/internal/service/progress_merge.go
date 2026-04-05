package service

import "github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/model"

func MergeNode(cloud, local model.ProgressNode) model.ProgressNode {
	result := cloud
	if local.UpdatedAt.After(cloud.UpdatedAt) {
		result = local
	}
	if cloud.Completed || local.Completed {
		result.Completed = true
	}
	if local.UpdatedAt.After(result.UpdatedAt) {
		result.UpdatedAt = local.UpdatedAt
	}
	return result
}

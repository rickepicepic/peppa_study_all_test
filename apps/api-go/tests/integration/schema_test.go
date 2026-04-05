package integration

import (
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/zoupengcheng/network-learning-platform/apps/api-go/tests/integration/testdb"
)

func TestSchemaHasCoreTables(t *testing.T) {
	db := testdb.NewMigratedDB(t)
	tables := []string{
		"subjects",
		"quizzes",
		"quiz_questions",
		"question_options",
		"user_progress",
		"user_wrong_questions",
		"user_quiz_attempts",
		"attempt_answers",
	}

	for _, table := range tables {
		require.True(t, testdb.TableExists(t, db, table), table)
	}
}

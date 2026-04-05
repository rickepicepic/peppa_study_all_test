package testdb

import (
	"database/sql"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/require"
)

func NewMigratedDB(t *testing.T) *sql.DB {
	t.Helper()

	dsn := os.Getenv("TEST_MYSQL_DSN")
	if dsn == "" {
		t.Skip("TEST_MYSQL_DSN is not set; skipping mysql integration test")
	}

	db, err := sql.Open("mysql", dsn)
	require.NoError(t, err)
	t.Cleanup(func() { _ = db.Close() })

	require.NoError(t, db.Ping())
	applyMigrations(t, db)
	return db
}

func TableExists(t *testing.T, db *sql.DB, table string) bool {
	t.Helper()
	var name string
	err := db.QueryRow(
		"SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1",
		table,
	).Scan(&name)
	if err == sql.ErrNoRows {
		return false
	}
	require.NoError(t, err)
	return true
}

func applyMigrations(t *testing.T, db *sql.DB) {
	t.Helper()

	migrationDir := filepath.Join("..", "..", "db", "migrations")
	files, err := filepath.Glob(filepath.Join(migrationDir, "*.up.sql"))
	require.NoError(t, err)
	sort.Strings(files)
	require.NotEmpty(t, files)

	for _, file := range files {
		content, err := os.ReadFile(file)
		require.NoError(t, err)
		statements := splitSQLStatements(string(content))
		for _, stmt := range statements {
			if strings.TrimSpace(stmt) == "" {
				continue
			}
			_, err = db.Exec(stmt)
			require.NoError(t, err, "failed executing migration %s", file)
		}
	}
}

func splitSQLStatements(sqlText string) []string {
	parts := strings.Split(sqlText, ";")
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

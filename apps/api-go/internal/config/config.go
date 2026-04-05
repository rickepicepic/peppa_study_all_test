package config

import "os"

type Config struct {
	HTTPAddr    string
	AuthEnabled bool
	JWTSecret   string
	MySQLDSN    string
	CORSOrigins string
}

func Load() Config {
	addr := os.Getenv("API_HTTP_ADDR")
	if addr == "" {
		addr = ":8080"
	}
	authEnabled := os.Getenv("AUTH_ENABLED") == "true"
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-change-me"
	}
	mySQLDSN := os.Getenv("MYSQL_DSN")
	corsOrigins := os.Getenv("CORS_ALLOW_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "http://localhost:5173,http://127.0.0.1:5173"
	}

	return Config{HTTPAddr: addr, AuthEnabled: authEnabled, JWTSecret: jwtSecret, MySQLDSN: mySQLDSN, CORSOrigins: corsOrigins}
}

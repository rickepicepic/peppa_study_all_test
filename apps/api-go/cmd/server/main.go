package main

import (
	"log"

	"github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/config"
	httpserver "github.com/zoupengcheng/network-learning-platform/apps/api-go/internal/http"
)

func main() {
	cfg := config.Load()
	deps := httpserver.NewDependencies(cfg)
	r := httpserver.NewRouter(deps)

	log.Printf("api-go listening on %s", cfg.HTTPAddr)
	if err := r.Run(cfg.HTTPAddr); err != nil {
		log.Fatal(err)
	}
}

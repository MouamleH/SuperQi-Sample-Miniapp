package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	recover2 "github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"log"
	"os"
	"superQiMiniAppBackend/alipay"
	"superQiMiniAppBackend/api"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	err := alipay.InitAlipayClient()
	if err := err; err != nil {
		log.Fatal(err)
	}

	app := initWebServer()

	apiGroup := app.Group("/api")
	api.InitAuthEndpoint(apiGroup)

	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "1999"
	}
	log.Fatal(app.Listen(":" + port))
}

func initWebServer() *fiber.App {
	app := fiber.New()

	app.Use(cors.New())
	app.Use(recover2.New())

	return app
}

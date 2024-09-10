package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/karaca-i/gomodule/database"
	"github.com/karaca-i/gomodule/routes"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:4000"}, // Your frontend origin
		AllowCredentials: true,
	}))

	database.Connect()
	routes.Setup(app)

	app.Listen(":4000")
}

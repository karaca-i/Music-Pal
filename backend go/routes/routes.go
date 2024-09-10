package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/karaca-i/gomodule/controllers"
)

func Setup(app *fiber.App) {
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Post("/api/logout", controllers.Logout)

	app.Post("/api/user-match", controllers.UserMatch2)
	app.Post("/api/taste-allow", controllers.UserMatchTasteAllow)
}

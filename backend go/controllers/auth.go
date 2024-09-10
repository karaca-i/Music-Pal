package controllers

import (
	"os"
	"strconv"

	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/karaca-i/gomodule/database"
	"golang.org/x/crypto/bcrypt"
)

var SecretKey = os.Getenv("GO_SECRET_KEY")

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c fiber.Ctx) error {
	var data RegisterRequest

	if err := c.Bind().Body(&data); err != nil {
		return err
	}

	pw, _ := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

	user := database.User{
		Name:     data.Name,
		Email:    data.Email,
		Password: pw,
	}

	database.DB.Create(&user)

	return c.JSON(user)
}

func Login(c fiber.Ctx) error {
	var data LoginRequest

	if err := c.Bind().Body(&data); err != nil {
		return err
	}

	var user database.User

	database.DB.Where("email = ?", data.Email).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data.Password)); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Incorrect password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
		SameSite: "None",
		Secure:   false,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func User(c fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthenticated",
		})
	}

	claims := token.Claims

	var user database.User

	database.DB.Where("id = ?", claims.(*jwt.RegisteredClaims).Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c fiber.Ctx) error {

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour * 24),
		HTTPOnly: true,
		SameSite: "None",
		Secure:   false,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Successfully logged out",
	})
}

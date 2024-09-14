package controllers

import (
	"fmt"
	"log"
	"math"
	"sort"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/karaca-i/gomodule/database"
)

type DistancePair struct {
	Distance float64
	UserID   uint
}

type AudioFeature struct {
	ID               string  `json:"id"`
	DurationMs       int     `json:"duration_ms"`
	Danceability     float64 `json:"danceability"`
	Energy           float64 `json:"energy"`
	Loudness         float64 `json:"loudness"`
	Speechiness      float64 `json:"speechiness"`
	Acousticness     float64 `json:"acousticness"`
	Instrumentalness float64 `json:"instrumentalness"`
	Liveness         float64 `json:"liveness"`
	Valence          float64 `json:"valence"`
	Tempo            float64 `json:"tempo"`
}

type GenreScores struct {
	Classical  int `json:"classical"`
	Country    int `json:"country"`
	Electronic int `json:"electronic"`
	Dance      int `json:"dance"`
	Disco      int `json:"disco"`
	HipHop     int `json:"hip-hop"`
	Jazz       int `json:"jazz"`
	Metal      int `json:"metal"`
	Pop        int `json:"pop"`
	Rnb        int `json:"r-n-b"`
	Rock       int `json:"rock"`
	House      int `json:"house"`
}

type Taste struct {
	GenreScores   GenreScores    `json:"genre_scores"`
	AudioFeatures []AudioFeature `json:"audio_features"`
	ID            uint           `json:"id"`
}

type UserSimilarity struct {
	ID         int
	Name       string
	Similarity int
}

func UserMatchTasteAllow(c fiber.Ctx) error {
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

	// get Taste data
	var data Taste

	if err := c.Bind().Body(&data); err != nil {
		return err
	}

	user.TasteMatch = true
	user.GenreScores = database.GenreScores{
		Classical:  data.GenreScores.Classical,
		Country:    data.GenreScores.Country,
		Electronic: data.GenreScores.Electronic,
		Dance:      data.GenreScores.Dance,
		Disco:      data.GenreScores.Disco,
		HipHop:     data.GenreScores.HipHop,
		Jazz:       data.GenreScores.Jazz,
		Metal:      data.GenreScores.Metal,
		Pop:        data.GenreScores.Pop,
		Rnb:        data.GenreScores.Rnb,
		Rock:       data.GenreScores.Rock,
		House:      data.GenreScores.House,
	}

	var featureMedium = FeatureMedium{
		Danceability:     0.0,
		Energy:           0.0,
		Loudness:         0.0,
		Speechiness:      0.0,
		Acousticness:     0.0,
		Instrumentalness: 0.0,
		Liveness:         0.0,
		Valence:          0.0,
		Tempo:            0.0,
	}

	for _, track := range data.AudioFeatures {
		featureMedium.Danceability += track.Danceability
		featureMedium.Energy += track.Energy
		featureMedium.Loudness += track.Loudness
		featureMedium.Speechiness += track.Speechiness
		featureMedium.Acousticness += track.Acousticness
		featureMedium.Instrumentalness += track.Instrumentalness
		featureMedium.Liveness += track.Liveness
		featureMedium.Valence += track.Valence
		featureMedium.Tempo += track.Tempo
	}

	user.Features = database.FeatureMedium(featureMedium)
	/*
	 */

	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update user",
		})
	}

	return c.JSON(user)
}

func CosineSimilarity(a, b []float64) float64 {
	var dotProduct float64
	var normA float64
	var normB float64

	for i := 0; i < len(a); i++ {
		dotProduct += a[i] * b[i]
		normA += a[i] * a[i]
		normB += b[i] * b[i]
	}

	return dotProduct / (math.Sqrt(normA) * math.Sqrt(normB))
}

type FeatureMedium struct {
	Danceability     float64 `json:"danceability"`
	Energy           float64 `json:"energy"`
	Loudness         float64 `json:"loudness"`
	Speechiness      float64 `json:"speechiness"`
	Acousticness     float64 `json:"acousticness"`
	Instrumentalness float64 `json:"instrumentalness"`
	Liveness         float64 `json:"liveness"`
	Valence          float64 `json:"valence"`
	Tempo            float64 `json:"tempo"`
}

func UserMatch2(c fiber.Ctx) error {

	//
	var data Taste

	if err := c.Bind().Body(&data); err != nil {
		return err
	}

	// get track features
	// Audio Features cosine similarity
	track_len := len(data.AudioFeatures)

	var featureMedium = FeatureMedium{
		Danceability:     0.0,
		Energy:           0.0,
		Loudness:         0.0,
		Speechiness:      0.0,
		Acousticness:     0.0,
		Instrumentalness: 0.0,
		Liveness:         0.0,
		Valence:          0.0,
		Tempo:            0.0,
	}

	for _, track := range data.AudioFeatures {
		featureMedium.Danceability += track.Danceability
		featureMedium.Energy += track.Energy
		featureMedium.Loudness += track.Loudness
		featureMedium.Speechiness += track.Speechiness
		featureMedium.Acousticness += track.Acousticness
		featureMedium.Instrumentalness += track.Instrumentalness
		featureMedium.Liveness += track.Liveness
		featureMedium.Valence += track.Valence
		featureMedium.Tempo += track.Tempo
	}

	featureMedium.Danceability /= float64(track_len)
	featureMedium.Energy /= float64(track_len)
	featureMedium.Loudness /= float64(track_len)
	featureMedium.Speechiness /= float64(track_len)
	featureMedium.Acousticness /= float64(track_len)
	featureMedium.Instrumentalness /= float64(track_len)
	featureMedium.Liveness /= float64(track_len)
	featureMedium.Valence /= float64(track_len)
	featureMedium.Tempo /= float64(track_len)

	var matchedUsers []database.User

	err2 := database.DB.Where("taste_match = ?", true).Find(&matchedUsers).Error
	if err2 != nil {
		log.Println("Error fetching matched users:", err2)
		return err2
	}

	var userSimilarities []UserSimilarity

	similarity := 0
	for _, user := range matchedUsers {
		userScores := user.GenreScores
		dataScores := data.GenreScores

		similarity += int(math.Min(float64(userScores.Classical), float64(dataScores.Classical)))
		similarity += int(math.Min(float64(userScores.Country), float64(dataScores.Country)))
		similarity += int(math.Min(float64(userScores.Electronic), float64(dataScores.Electronic)))
		similarity += int(math.Min(float64(userScores.Dance), float64(dataScores.Dance)))
		similarity += int(math.Min(float64(userScores.Disco), float64(dataScores.Disco)))
		similarity += int(math.Min(float64(userScores.HipHop), float64(dataScores.HipHop)))
		similarity += int(math.Min(float64(userScores.Jazz), float64(dataScores.Jazz)))
		similarity += int(math.Min(float64(userScores.Metal), float64(dataScores.Metal)))
		similarity += int(math.Min(float64(userScores.Pop), float64(dataScores.Pop)))
		similarity += int(math.Min(float64(userScores.Rnb), float64(dataScores.Rnb)))
		similarity += int(math.Min(float64(userScores.Rock), float64(dataScores.Rock)))
		similarity += int(math.Min(float64(userScores.House), float64(dataScores.House)))
		similarity *= 4

		// cosine similarity
		cosine_similarity := CosineSimilarity([]float64{
			featureMedium.Danceability,
			featureMedium.Energy,
			featureMedium.Loudness,
			featureMedium.Speechiness,
			featureMedium.Acousticness,
			featureMedium.Instrumentalness,
			featureMedium.Liveness,
			featureMedium.Valence,
			featureMedium.Tempo,
		}, []float64{
			user.Features.Danceability,
			user.Features.Energy,
			user.Features.Loudness,
			user.Features.Speechiness,
			user.Features.Acousticness,
			user.Features.Instrumentalness,
			user.Features.Liveness,
			user.Features.Valence,
			user.Features.Tempo,
		})

		fmt.Println("cosine_similarity", cosine_similarity)

		similarity += int(cosine_similarity * 10)

		if data.ID != user.ID {
			userSimilarities = append(userSimilarities, UserSimilarity{
				ID:         int(user.ID),
				Name:       user.Name,
				Similarity: similarity,
			})
		}

		similarity = 0
	}

	sort.Slice(userSimilarities, func(i, j int) bool {
		return userSimilarities[i].Similarity > userSimilarities[j].Similarity
	})

	fmt.Println(userSimilarities)

	return c.JSON(fiber.Map{
		"user_similarities": userSimilarities,
		"taste":             data,
	})
}

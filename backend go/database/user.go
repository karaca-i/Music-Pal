package database

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

type User struct {
	ID          uint          `json:"id"`
	Name        string        `json:"name"`
	Email       string        `json:"email" gorm:"unique"`
	Password    []byte        `json:"-"`
	TasteMatch  bool          `json:"tastematch"`
	GenreScores GenreScores   `json:"genre_scores" gorm:"embedded"`
	Features    FeatureMedium `json:"features" gorm:"embedded"`
}

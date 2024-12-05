package models

type Product struct {
	ID    string  `json:"id" bson:"_id,omitempty"`
	Name  string  `json:"name" bson:"name"`
	Price float64 `json:"price" bson:"price"`
	Stock int     `json:"stock" bson:"stock"`
}

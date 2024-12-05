package database

import (
	"context"
	"test-tripatra-go/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// CheckEmailExists checks if the email already exists in the users collection
func CheckEmailExists(collection *mongo.Collection, email string) (bool, error) {
	var user models.User
	err := collection.FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil // Email does not exist
		}
		return false, err // Some other error occurred
	}
	return true, nil // Email exists
}

package schema

import (
	"context"
	"log"
	"test-tripatra-go/database"
	"test-tripatra-go/models"

	"github.com/graphql-go/graphql"
	"github.com/olivere/elastic/v7"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var userType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id":    &graphql.Field{Type: graphql.String},
		"name":  &graphql.Field{Type: graphql.String},
		"email": &graphql.Field{Type: graphql.String},
	},
})

var productType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Product",
	Fields: graphql.Fields{
		"id":    &graphql.Field{Type: graphql.String},
		"name":  &graphql.Field{Type: graphql.String},
		"price": &graphql.Field{Type: graphql.Float},
		"stock": &graphql.Field{Type: graphql.Int},
	},
})

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootQuery",
	Fields: graphql.Fields{
		"user": &graphql.Field{
			Type: graphql.NewList(userType), // Return a list of users
			Args: graphql.FieldConfigArgument{
				"id":    &graphql.ArgumentConfig{Type: graphql.String},
				"name":  &graphql.ArgumentConfig{Type: graphql.String},
				"email": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var filter bson.M = bson.M{}

				// Check for id argument
				if id, ok := p.Args["id"].(string); ok && id != "" {
					objID, err := primitive.ObjectIDFromHex(id)
					if err == nil {
						filter["_id"] = objID
					}
				}

				// Check for name argument
				if name, ok := p.Args["name"].(string); ok && name != "" {
					// Use a regular expression for case-insensitive matching
					filter["name"] = bson.M{"$regex": primitive.Regex{Pattern: name, Options: "i"}}
				}

				// Check for email argument
				if email, ok := p.Args["email"].(string); ok && email != "" {
					filter["email"] = email
				}

				var users []models.User
				collection := database.MongoClient.Database("yourdbname").Collection("users")
				cursor, err := collection.Find(context.TODO(), filter)
				if err != nil {
					log.Printf("Error finding users: %v", err) // Log the error
					return nil, err
				}
				defer cursor.Close(context.TODO())

				// Decode the results into a slice of users
				for cursor.Next(context.TODO()) {
					var user models.User
					if err := cursor.Decode(&user); err != nil {
						log.Printf("Error decoding user: %v", err) // Log the error
						return nil, err
					}
					users = append(users, user)
				}

				// Check if no users were found
				if len(users) == 0 {
					log.Println("No users found matching the criteria.")
				}

				return users, nil
			},
		},
		"product": &graphql.Field{
			Type: graphql.NewList(productType), // Return a list of products
			Args: graphql.FieldConfigArgument{
				"id":    &graphql.ArgumentConfig{Type: graphql.String},
				"name":  &graphql.ArgumentConfig{Type: graphql.String},
				"price": &graphql.ArgumentConfig{Type: graphql.Float},
				"stock": &graphql.ArgumentConfig{Type: graphql.Int},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var filter bson.M = bson.M{}

				// Check for id argument
				if id, ok := p.Args["id"].(string); ok && id != "" {
					objID, err := primitive.ObjectIDFromHex(id)
					if err == nil {
						filter["_id"] = objID
					}
				}

				// Check for name argument
				if name, ok := p.Args["name"].(string); ok && name != "" {
					// Use a regular expression for case-insensitive matching
					filter["name"] = bson.M{"$regex": primitive.Regex{Pattern: name, Options: "i"}}
				}

				// Check for price argument
				if price, ok := p.Args["price"].(float64); ok {
					// Assuming you want to find products with the exact price
					filter["price"] = price
				}

				// Check for stock argument
				if stock, ok := p.Args["stock"].(int); ok {
					// Assuming you want to find products with the exact stock
					filter["stock"] = stock
				}

				var products []models.Product
				collection := database.MongoClient.Database("yourdbname").Collection("products")
				cursor, err := collection.Find(context.TODO(), filter)
				if err != nil {
					log.Printf("Error finding products: %v", err) // Log the error
					return nil, err
				}
				defer cursor.Close(context.TODO())

				// Decode the results into a slice of products
				for cursor.Next(context.TODO()) {
					var product models.Product
					if err := cursor.Decode(&product); err != nil {
						log.Printf("Error decoding product: %v", err) // Log the error
						return nil, err
					}
					products = append(products, product)
				}

				// Check if no products were found
				if len(products) == 0 {
					log.Println("No products found matching the criteria.")
				}

				return products, nil
			},
		},
		"users": &graphql.Field{
			Type: graphql.NewList(userType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var users []models.User
				collection := database.MongoClient.Database("yourdbname").Collection("users")
				cursor, err := collection.Find(context.TODO(), bson.D{})
				if err != nil {
					return nil, err
				}
				for cursor.Next(context.TODO()) {
					var user models.User
					cursor.Decode(&user)
					users = append(users, user)
				}
				return users, nil
			},
		},
		"products": &graphql.Field{
			Type: graphql.NewList(productType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var products []models.Product
				collection := database.MongoClient.Database("yourdbname").Collection("products")
				cursor, err := collection.Find(context.TODO(), bson.D{})
				if err != nil {
					return nil, err
				}
				for cursor.Next(context.TODO()) {
					var product models.Product
					cursor.Decode(&product)
					products = append(products, product)
				}
				return products, nil
			},
		},
	},
})

var mutationType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"addUser": &graphql.Field{
			Type: userType,
			Args: graphql.FieldConfigArgument{
				"name":  &graphql.ArgumentConfig{Type: graphql.String},
				"email": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				name, _ := p.Args["name"].(string)
				email, _ := p.Args["email"].(string)
				user := models.User{Name: name, Email: email}
				collection := database.MongoClient.Database("yourdbname").Collection("users")
				// Check if the email already exists
				exists, err := database.CheckEmailExists(collection, email)
				if err != nil {
					return err, nil
				}
				if exists {
					return exists, err
				}

				// Insert user into MongoDB
				result, err := collection.InsertOne(context.TODO(), user)
				if err != nil {
					return nil, err
				}

				user.ID = result.InsertedID.(primitive.ObjectID).Hex()
				// Index user in Elasticsearch
				_, err = database.ElasticClient.Index().
					Index("users").
					Id(user.ID).
					BodyJson(user).
					Do(context.Background())
				if err != nil {
					return nil, err
				}
				// Return success response
				return user, err
			},
		},
		"addProduct": &graphql.Field{
			Type: productType,
			Args: graphql.FieldConfigArgument{
				"name":  &graphql.ArgumentConfig{Type: graphql.String},
				"price": &graphql.ArgumentConfig{Type: graphql.Float},
				"stock": &graphql.ArgumentConfig{Type: graphql.Int},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				name, _ := p.Args["name"].(string)
				price, _ := p.Args["price"].(float64)
				stock, _ := p.Args["stock"].(int)
				product := models.Product{Name: name, Price: price, Stock: stock}
				collection := database.MongoClient.Database("yourdbname").Collection("products")
				result, err := collection.InsertOne(context.TODO(), product)
				if err != nil {
					return nil, err
				}
				log.Println(result)
				product.ID = result.InsertedID.(primitive.ObjectID).Hex()
				_, err = database.ElasticClient.Index().
					Index("products").
					Id(product.ID).
					BodyJson(product).
					Do(context.Background())
				log.Println("this must be it")
				return product, err
			},
		},
		"deleteUser": &graphql.Field{
			Type: userType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, _ := p.Args["id"].(string)
				objID, _ := primitive.ObjectIDFromHex(id)
				collection := database.MongoClient.Database("yourdbname").Collection("users")
				_, err := collection.DeleteOne(context.TODO(), bson.M{"_id": objID})
				if err != nil {
					return nil, err
				}
				_, err = database.ElasticClient.Delete().
					Index("users").
					Id(id).
					Do(context.Background())
				return nil, err
			},
		},
		"deleteAllUsers": &graphql.Field{
			Type: graphql.String, // You can return a string message indicating success
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				collection := database.MongoClient.Database("yourdbname").Collection("users")

				// Delete all users from MongoDB
				_, err := collection.DeleteMany(context.TODO(), bson.D{})
				if err != nil {
					return nil, err
				}

				// Optionally, delete all users from Elasticsearch
				_, err = database.ElasticClient.DeleteByQuery().
					Index("users").
					Query(elastic.NewMatchAllQuery()). // Match all documents
					Do(context.Background())
				if err != nil {
					return nil, err
				}

				return "All users deleted successfully", nil // Return success message
			},
		},
		"deleteProduct": &graphql.Field{
			Type: productType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, _ := p.Args["id"].(string)
				objID, _ := primitive.ObjectIDFromHex(id)
				collection := database.MongoClient.Database("yourdbname").Collection("products")
				_, err := collection.DeleteOne(context.TODO(), bson.M{"_id": objID})
				if err != nil {
					return nil, err
				}
				_, err = database.ElasticClient.Delete().
					Index("products").
					Id(id).
					Do(context.Background())
				return nil, err
			},
		},
		"updateUser": &graphql.Field{
			Type: userType,
			Args: graphql.FieldConfigArgument{
				"id":    &graphql.ArgumentConfig{Type: graphql.String},
				"name":  &graphql.ArgumentConfig{Type: graphql.String},
				"email": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, _ := p.Args["id"].(string)
				name, _ := p.Args["name"].(string)
				email, _ := p.Args["email"].(string)
				objID, _ := primitive.ObjectIDFromHex(id)
				collection := database.MongoClient.Database("yourdbname").Collection("users")
				exists, err := database.CheckEmailExists(collection, email)
				if err != nil {
					return err, nil
				}
				if exists {
					return exists, err
				}

				// Insert user into MongoDB
				_, err = collection.UpdateOne(context.TODO(), bson.M{"_id": objID}, bson.M{"$set": bson.M{"name": name, "email": email}})
				if err != nil {
					return nil, err
				}

				if err != nil {
					return nil, err
				}
				user := models.User{ID: id, Name: name, Email: email}
				_, err = database.ElasticClient.Update().
					Index("users").
					Id(id).
					Doc(user).
					Do(context.Background())
				return user, err
			},
		},
		"updateProduct": &graphql.Field{
			Type: productType,
			Args: graphql.FieldConfigArgument{
				"id":    &graphql.ArgumentConfig{Type: graphql.String},
				"name":  &graphql.ArgumentConfig{Type: graphql.String},
				"price": &graphql.ArgumentConfig{Type: graphql.Float},
				"stock": &graphql.ArgumentConfig{Type: graphql.Int},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, _ := p.Args["id"].(string)
				name, _ := p.Args["name"].(string)
				price, _ := p.Args["price"].(float64)
				stock, _ := p.Args["stock"].(int)
				objID, _ := primitive.ObjectIDFromHex(id)
				collection := database.MongoClient.Database("yourdbname").Collection("products")
				_, err := collection.UpdateOne(context.TODO(), bson.M{"_id": objID}, bson.M{"$set": bson.M{"name": name, "price": price, "stock": stock}})
				if err != nil {
					return nil, err
				}
				product := models.Product{ID: id, Name: name, Price: price, Stock: stock}
				_, err = database.ElasticClient.Update().
					Index("products").
					Id(id).
					Doc(product).
					Do(context.Background())
				return product, err
			},
		},
	},
})

var Schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: mutationType,
})

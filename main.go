package main

import (
	"log"
	"test-tripatra-go/database"
	"test-tripatra-go/schema"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/handler"
)

func main() {
	// Connect to MongoDB
	database.ConnectMongoDB("mongodb://localhost:27017")

	// Connect to Elasticsearch
	database.ConnectElasticSearch("https://localhost:9200", "elastic", "xmDsKbqjXXPvkexJT*vJ")

	// Set up Gin
	r := gin.Default()
	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},                                       // Allow your frontend origin
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},                  // Allow specific methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Allow specific headers
		ExposeHeaders:    []string{"Content-Length"},                          // Expose specific headers
		AllowCredentials: true,                                                // Allow credentials
	}))
	// GraphQL handler
	graphqlHandler := handler.New(&handler.Config{
		Schema:   &schema.Schema, // Use the exported Schema variable
		Pretty:   true,
		GraphiQL: true,
	})

	r.POST("/graphql", func(c *gin.Context) {
		graphqlHandler.ServeHTTP(c.Writer, c.Request)

	})

	r.GET("/graphql", func(c *gin.Context) {
		graphqlHandler.ServeHTTP(c.Writer, c.Request)
	})

	// Start the server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server Run Failed:", err)
	}
}

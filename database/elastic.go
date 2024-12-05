package database

import (
	"crypto/tls"
	"log"
	"net/http"

	"github.com/olivere/elastic/v7"
)

var ElasticClient *elastic.Client

// ConnectElasticSearch initializes the Elasticsearch client
func ConnectElasticSearch(url, username, password string) {
	// Create a custom HTTP client that skips TLS verification
	httpClient := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, // Skip TLS verification
		},
	}

	client, err := elastic.NewClient(
		elastic.SetURL(url),
		elastic.SetBasicAuth(username, password),
		elastic.SetHttpClient(httpClient), // Use the custom HTTP client
		elastic.SetSniff(false),
	)
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}
	ElasticClient = client
	log.Println("Connected to Elasticsearch!")
}

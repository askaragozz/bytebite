package com.askaragoz.bytebite.restaurant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class RestaurantSearchRepository {

    private final RestTemplate restTemplate;

    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUri;

    public RestaurantSearchRepository() {
        this.restTemplate = new RestTemplate();
    }

    public void index(RestaurantDocument document) {
        String url = elasticsearchUri + "/restaurants/_doc/" + document.getId();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<RestaurantDocument> request = new HttpEntity<>(document, headers);
        restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
    }

    @SuppressWarnings("unchecked")
    public List<RestaurantDocument> search(String query) {
        String url = elasticsearchUri + "/restaurants/_search";
        String body = """
                {
                  "query": {
                    "multi_match": {
                      "query": "%s",
                      "fields": ["name", "description", "cuisineType"]
                    }
                  }
                }
                """.formatted(query);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request,
                new ParameterizedTypeReference<>() {});

        Map<String, Object> hits = (Map<String, Object>) response.getBody().get("hits");
        List<Map<String, Object>> hitList = (List<Map<String, Object>>) hits.get("hits");

        return hitList.stream()
                .map(hit -> {
                    Map<String, Object> source = (Map<String, Object>) hit.get("_source");
                    return new RestaurantDocument(
                            (String) hit.get("_id"),
                            (String) source.get("name"),
                            (String) source.get("description"),
                            (String) source.get("cuisineType")
                    );
                })
                .toList();
    }
}

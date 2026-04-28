package com.askaragoz.bytebite.elasticsearch;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElasticsearchService {
    @Value("${spring.elasticsearch.uris}")
    private String url;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ElasticsearchService(RestTemplate restTemplate, ObjectMapper objectMapper){
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public void index(String indexName, String id, Object document){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Object> request = new HttpEntity<>(document, headers);
        String fullUrl = url + "/" + indexName + "/_doc/" + id;
        restTemplate.exchange(fullUrl, HttpMethod.PUT, request, String.class);
    }

    @SuppressWarnings("unchecked")
    public <T> List<T> search(String indexName, String query, List<String> fields, Class<T> resultType) {
        String fullUrl = url + "/" + indexName + "/_search";

        String fieldsJson = fields.stream()
                .map(f -> "\"" + f + "\"")
                .collect(Collectors.joining(","));

        String body = """
                {"query":{"multi_match":{"query":"%s","type":"phrase_prefix","fields":[%s]}}}
                """.formatted(query, fieldsJson);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                fullUrl, HttpMethod.POST, request,
                new ParameterizedTypeReference<>() {});

        Map<String, Object> hits = (Map<String, Object>) response.getBody().get("hits");
        List<Map<String, Object>> hitList = (List<Map<String, Object>>) hits.get("hits");

        return hitList.stream()
                .map(hit -> objectMapper.convertValue(hit.get("_source"), resultType))
                .toList();
    }
}

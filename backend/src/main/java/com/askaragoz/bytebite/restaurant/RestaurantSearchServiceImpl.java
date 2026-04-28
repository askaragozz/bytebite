package com.askaragoz.bytebite.restaurant;

import com.askaragoz.bytebite.elasticsearch.ElasticsearchService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantSearchServiceImpl implements RestaurantSearchRepository {
    private final ElasticsearchService elasticsearchService;

    public RestaurantSearchServiceImpl(ElasticsearchService elasticsearchService){
        this.elasticsearchService = elasticsearchService;
    }

    public void index(RestaurantDocument document){
        elasticsearchService.index("restaurants", document.getId(), document);
    }

    public List<RestaurantDocument> search(String query){
        return elasticsearchService.search(
                "restaurants",
                query,
                List.of("name",
                        "description",
                        "cuisineType"),
                RestaurantDocument.class
        );
    }
}

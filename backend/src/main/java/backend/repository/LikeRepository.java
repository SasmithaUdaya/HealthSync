package com.example.ranthilini.repositories;

import com.example.ranthilini.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LikeRepository extends MongoRepository<Like, String> {
}

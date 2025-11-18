package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.Tracks;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TracksRepo extends MongoRepository<Tracks, String> {
    List<Tracks> findAllByUsername(String username);
}

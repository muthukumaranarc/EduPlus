package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.ProgressTrack;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressTrackRepo extends MongoRepository<ProgressTrack, String> {
    ProgressTrack findUserByUsername(String username);
}

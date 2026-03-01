package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.UserTrophy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrophyRepo extends MongoRepository<UserTrophy, String> {
    UserTrophy findByUsername(String username);
}

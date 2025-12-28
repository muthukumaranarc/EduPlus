package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.Friends;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendsRepo extends MongoRepository<Friends, String> {
    Optional<Friends> findByUsername(String username);
}

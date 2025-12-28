package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.AboutUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AboutUserRepo extends MongoRepository<AboutUser, String> {
    Optional<AboutUser> findByUsername(String username);
}

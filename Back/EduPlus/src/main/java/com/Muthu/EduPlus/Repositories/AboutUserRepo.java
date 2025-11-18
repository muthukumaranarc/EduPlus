package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.AboutUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AboutUserRepo extends MongoRepository<AboutUser, String> {
    AboutUser findByUsername(String username);
}

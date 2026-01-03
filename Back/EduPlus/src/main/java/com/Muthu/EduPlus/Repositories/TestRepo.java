package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.UserTest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepo extends MongoRepository<UserTest, String> {
    UserTest findUserByUsername(String username);
}

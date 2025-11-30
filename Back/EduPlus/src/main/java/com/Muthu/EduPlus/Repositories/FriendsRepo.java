package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.Friends;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FriendsRepo extends MongoRepository<Friends, String> {

}

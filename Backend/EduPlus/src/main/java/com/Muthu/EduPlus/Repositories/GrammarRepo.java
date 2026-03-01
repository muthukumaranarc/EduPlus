package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.GrammarConcepts;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface GrammarRepo extends MongoRepository<GrammarConcepts, String> {
    GrammarConcepts findByUsername(String username);
}

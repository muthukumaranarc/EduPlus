package com.Muthu.EduPlus.Repositories;

import com.Muthu.EduPlus.Models.Syllabus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SyllabusRepository extends MongoRepository<Syllabus, String> {

    List<Syllabus> findByUsername(String username);

    List<Syllabus> findByUsernameAndSubject(String username, String subject);

    List<Syllabus> findByUsernameAndSubjectAndUnit(String username, String subject, String unit);
}

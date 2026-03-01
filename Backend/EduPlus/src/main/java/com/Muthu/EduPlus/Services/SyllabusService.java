package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.Syllabus;
import com.Muthu.EduPlus.Repositories.SyllabusRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SyllabusService {

    private final SyllabusRepository syllabusRepository;

    public SyllabusService(SyllabusRepository syllabusRepository) {
        this.syllabusRepository = syllabusRepository;
    }

    public Syllabus uploadSyllabus(String username, String subject, String unit, String topic, String content) {
        Syllabus syllabus = new Syllabus(username, subject, unit, topic, content);
        return syllabusRepository.save(syllabus);
    }

    public List<Syllabus> getAllSyllabus(String username) {
        return syllabusRepository.findByUsername(username);
    }

    public List<String> getSubjects(String username) {
        return syllabusRepository.findByUsername(username)
                .stream()
                .map(Syllabus::getSubject)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public boolean deleteSyllabus(String id, String username) {
        Optional<Syllabus> optional = syllabusRepository.findById(id);
        if (optional.isPresent() && optional.get().getUsername().equals(username)) {
            syllabusRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public String findRelevantContent(String username, String question) {
        List<Syllabus> entries = syllabusRepository.findByUsername(username);
        if (entries.isEmpty() || question == null || question.isBlank()) {
            return "";
        }

        // Tokenise question into lowercase keywords (skip very short words)
        String[] tokens = question.toLowerCase().split("\\s+");
        List<String> keywords = Arrays.stream(tokens)
                .filter(t -> t.length() > 2)
                .collect(Collectors.toList());

        if (keywords.isEmpty()) {
            return "";
        }

        StringBuilder combined = new StringBuilder();

        for (Syllabus entry : entries) {
            String haystack = (entry.getSubject() + " " +
                    entry.getUnit() + " " +
                    entry.getTopic() + " " +
                    entry.getContent()).toLowerCase();

            boolean matches = keywords.stream().anyMatch(haystack::contains);

            if (matches) {
                combined.append("[Subject: ").append(entry.getSubject())
                        .append(" | Unit: ").append(entry.getUnit())
                        .append(" | Topic: ").append(entry.getTopic())
                        .append("]\n")
                        .append(entry.getContent())
                        .append("\n\n");

                if (combined.length() >= 3000) {
                    break;
                }
            }
        }

        String result = combined.toString().trim();
        return result.length() > 3000 ? result.substring(0, 3000) : result;
    }
}

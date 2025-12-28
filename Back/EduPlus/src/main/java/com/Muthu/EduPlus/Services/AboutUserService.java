package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.AboutUser;
import com.Muthu.EduPlus.Repositories.AboutUserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AboutUserService {

    private final AboutUserRepo repo;

    public AboutUserService(AboutUserRepo repo) {
        this.repo = repo;
    }

    private String currentUsername() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    public void createUserData(String username, String name) {
        if (repo.findByUsername(username).isPresent()) return;

        AboutUser user = new AboutUser();
        user.setUsername(username);
        user.getData().add("Name: " + name);
        repo.save(user);
    }

    public List<String> getUserdata() {
        AboutUser user = repo.findByUsername(currentUsername())
                .orElseThrow(() -> new RuntimeException("AboutUser not found"));
        return user.getData();
    }

    public String getUserDataInString() {
        return String.join(";", getUserdata());
    }

    public void addData(String info) {
        AboutUser user = repo.findByUsername(currentUsername())
                .orElseThrow(() -> new RuntimeException("AboutUser not found"));
        user.getData().add(info);
        repo.save(user);
    }

    public boolean removeData(String info) {
        AboutUser user = repo.findByUsername(currentUsername())
                .orElseThrow(() -> new RuntimeException("AboutUser not found"));

        boolean removed = user.getData().remove(info);
        if (removed) repo.save(user);
        return removed;
    }

    public boolean replaceData(String oldInfo, String newInfo) {
        AboutUser user = repo.findByUsername(currentUsername())
                .orElseThrow(() -> new RuntimeException("AboutUser not found"));

        int index = user.getData().indexOf(oldInfo);
        if (index == -1) return false;

        user.getData().set(index, newInfo);
        repo.save(user);
        return true;
    }

    public void updateUsernameByOldUsername(String oldUsername, String newUsername) {
        AboutUser user = repo.findByUsername(oldUsername)
                .orElseThrow(() -> new RuntimeException("AboutUser not found"));
        user.setUsername(newUsername);
        repo.save(user);
    }

    public void deleteByUsername(String username) {
        repo.findByUsername(username).ifPresent(repo::delete);
    }

    public void deleteAll() {
        repo.deleteAll();
    }
}

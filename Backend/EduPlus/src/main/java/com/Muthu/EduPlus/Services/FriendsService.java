package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.Friends;
import com.Muthu.EduPlus.Repositories.FriendsRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class FriendsService {

    @Autowired
    private FriendsRepo friendsRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private HttpServletRequest request;

    private final UserService userService;

    public FriendsService(@Lazy UserService userService) {
        this.userService = userService;
    }

    private String currentUsername() {
        return jwtService.getCurrentUsername(request);
    }

    private Friends getCurrentUserEntity() {
        return friendsRepo.findByUsername(currentUsername())
                .orElseThrow(() -> new RuntimeException("Friends profile not found"));
    }


    public void createUser(String username) {
        if (friendsRepo.existsById(username)) {
            throw new RuntimeException("Friends profile already exists");
        }
        friendsRepo.save(new Friends(username));
    }

    public Friends getCurrentUser() {
        return getCurrentUserEntity();
    }

    public void changeUsername(String newUsername) {
        Friends user = getCurrentUserEntity();

        if (friendsRepo.existsById(newUsername)) {
            throw new RuntimeException("Username already taken");
        }

        friendsRepo.deleteById(user.getUsername());
        user.setUsername(newUsername);
        friendsRepo.save(user);
    }

    public void deleteUser(String username) {
        if (!friendsRepo.existsById(username)) {
            throw new RuntimeException("User not found");
        }
        friendsRepo.deleteById(username);
    }

    public void addFriend(String friendId) {
        Friends user = getCurrentUserEntity();

        if (!friendsRepo.existsById(friendId)) {
            throw new RuntimeException("Friend does not exist");
        }

        if (friendId.equals(user.getUsername())) {
            throw new RuntimeException("Cannot add yourself");
        }

        user.addFriend(friendId);
        friendsRepo.save(user);
        userService.updateFriends();
    }

    public void removeFriend(String friendId) {
        Friends user = getCurrentUserEntity();
        user.removeFriend(friendId);
        friendsRepo.save(user);
        userService.updateFriends();
    }
}

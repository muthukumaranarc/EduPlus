package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.Friends;
import com.Muthu.EduPlus.Repositories.FriendsRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FriendsService {

    @Autowired
    private FriendsRepo friendsRepo;

    public UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private HttpServletRequest request;

    public FriendsService(@Lazy UserService userService) {
        this.userService = userService;
    }

    public boolean createUser(String username) {
        try {
            Friends newUser = new Friends(
                    username,
                    new ArrayList<String>()
            );
            friendsRepo.save(newUser);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Friends getCurrentUser() {
        return friendsRepo.getUserByUsername(jwtService.getCurrentUsername(request));
    }

    public boolean changeUsername(String newUsername) {
        try {
            Friends data = getCurrentUser();
            String oldUsername = data.getUsername();
            data.setUsername(newUsername);
            friendsRepo.save(data);
            friendsRepo.deleteById(oldUsername);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteUser(String username) {
        try {
            friendsRepo.deleteById(username);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean addFriend(String id) {
        try {
            if(friendsRepo.getUserByUsername(id) == null) return false;
            Friends data = getCurrentUser();
            List<String> friends = data.getFriends();
            friends.add(id);
            data.setFriends(friends);
            friendsRepo.save(data);
            userService.updateFriends();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean removeFriend(String id) {
        try {
            Friends data = getCurrentUser();
            List<String> friends = data.getFriends();
            friends.remove(id);
            data.setFriends(friends);
            friendsRepo.save(data);
            userService.updateFriends();
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

}

package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.Friends;
import com.Muthu.EduPlus.Services.FriendsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/friends")
public class FriendsController {

    @Autowired
    private FriendsService service;

    @PostMapping("/create")
    public boolean createUser(@RequestBody String username){
        return service.createUser(username);
    }

    @GetMapping("/get-user")
    public Friends getUser() {
        return service.getCurrentUser();
    }

    @PostMapping("/change-username")
    public boolean changeUsername(@RequestBody String username) {
        return service.changeUsername(username);
    }

    @DeleteMapping("/delete-user")
    public boolean deleteUser(@RequestBody String username) {
        return service.deleteUser(username);
    }

    @PostMapping("/add-friend")
    public boolean addFriend(@RequestBody String friendId) {
        return service.addFriend(friendId);
    }

    @DeleteMapping("/delete-friend")
    public boolean removeFriend(@RequestBody String friendId) {
        return service.removeFriend(friendId);
    }
}

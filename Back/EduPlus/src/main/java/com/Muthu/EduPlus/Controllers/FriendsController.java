package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.Friends;
import com.Muthu.EduPlus.Services.FriendsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/friends")
public class FriendsController {

    @Autowired
    private FriendsService service;

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody String username) {
        service.createUser(username);
        return ResponseEntity.ok("Friends profile created");
    }

    @GetMapping("/me")
    public ResponseEntity<Friends> getUser() {
        return ResponseEntity.ok(service.getCurrentUser());
    }

    @PostMapping("/change-username")
    public ResponseEntity<?> changeUsername(@RequestBody String username) {
        service.changeUsername(username);
        return ResponseEntity.ok("Username updated");
    }

    @DeleteMapping("/delete/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        service.deleteUser(username);
        return ResponseEntity.ok("User deleted");
    }

    @PostMapping("/add/{friendId}")
    public ResponseEntity<?> addFriend(@PathVariable String friendId) {
        service.addFriend(friendId);
        return ResponseEntity.ok("Friend added");
    }

    @DeleteMapping("/remove/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable String friendId) {
        service.removeFriend(friendId);
        return ResponseEntity.ok("Friend removed");
    }
}

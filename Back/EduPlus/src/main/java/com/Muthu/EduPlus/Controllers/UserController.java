package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Services.JwtService;
import com.Muthu.EduPlus.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/create")
    public String createUser(@RequestBody User user, HttpServletResponse response){
        return service.createUser(user, response);
    }

    @PostMapping("/update-oauth")
    public boolean updateUserOAuth(@RequestBody User user) {
        return service.updateUserOAuth(user);
    }

    @GetMapping("/get-all")
    public List<User> getAllUsers(){
        return service.getAllUsers();
    }

    @GetMapping("/get-user")
    public User getCurrentUserName() {
        return service.getCurrentUserData();
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> data, HttpServletResponse response) {
        return service.login(data.get("username"), data.get("password"), response);
    }

    @GetMapping("/logout")
    public Boolean logout(HttpServletResponse response) {
        return service.logout(response);
    }

    @DeleteMapping("/delete")
    public boolean deleteUser(HttpServletResponse response) {
        return service.deleteUser(response);
    }

    @DeleteMapping("/delete-by-username")
    public String deleteByUsername(@RequestBody String username){
        return service.deleteUserByUsername(username);
    }

    @DeleteMapping("/delete-all")
    public String deleteAllUser() {
        return service.deleteAllUsers();
    }

    @GetMapping("/get-token")
    public String geToken(HttpServletRequest request){
        return jwtService.getTokenFromRequest(request);
    }

    @PostMapping("/is-user-exist")
    public boolean isUserExist(@RequestBody String username) {
        return service.isUserExist(username);
    }

    @PostMapping("/update-username")
    public String updateUsername(@RequestBody Map<String, String> data, HttpServletResponse response) {
        return service.updateUsername(
                data.get("usernameToChange"),
                data.get("password"),
                response
        );
    }

    @PostMapping("/update-password")
    public String updatePassword(@RequestBody Map<String, String> data) {
        return service.updatePassword(
                data.get("currentPassword"),
                data.get("newPassword")
        );
    }

    @PostMapping("/update-firstname")
    public String updateFirstname(@RequestBody Map<String, String> data) {
        return service.updateFirstname(
                data.get("password"),
                data.get("firstname")
        );
    }

    @PostMapping("/update-lastname")
    public String updateLastname(@RequestBody Map<String, String> data) {
        return service.updateLastname(
                data.get("password"),
                data.get("lastname")
        );
    }

    @PostMapping("/update-mobile-number")
    public String updateMobileNumber(@RequestBody Map<String, String> data) {
        return service.updateMobileNumber(
                data.get("password"),
                data.get("mobilenumber")
        );
    }

    @PostMapping("/update-mail-id")
    public String updateMailId(@RequestBody Map<String, String> data) {
        return service.UpdateMailId(
                data.get("password"),
                data.get("mailid")
        );
    }

    @PostMapping("/update-dob")
    public String updateDOB(@RequestBody Map<String, String> data) {
        return service.UpdateDOB(
                data.get("password"),
                data.get("dob") //yyyy-mm-dd formate only
        );
    }

    @PostMapping("/update-gender")
    public String updateGender(@RequestBody Map<String, String> data) {
        return service.updateGender(
                data.get("password"),
                data.get("gender")
        );
    }

    @PostMapping("/update-linkedin")
    public String updateLinkedIn(@RequestBody Map<String, String> data){
        return service.updateLinkedIn(
                data.get("password"),
                data.get("linkedin")
        );
    }

    @GetMapping("/get-username")
    public String getUsername(){
        return service.getUsernames();
    }

    @PostMapping("/trophies-add")
    public void addTrophies(@RequestBody Integer trophies) {
        service.sumTrophiesToCurrentUser(true, trophies);
    }

    @PostMapping("/trophies-sub")
    public void subTrophies(@RequestBody Integer trophies) {
        service.sumTrophiesToCurrentUser(false, trophies);
    }

}

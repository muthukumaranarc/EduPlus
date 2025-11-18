package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Services.AboutUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/about")
public class AboutUserController {

    @Autowired
    private AboutUserService service;

    @PostMapping("/create")
    public void createUserData(@RequestBody Map<String, String> data) {
        service.createUserData(
                data.get("username"),
                data.get("name")
        );
    }

    @GetMapping("/get")
    public List<String> getUserData() {
        return service.getUserdata();
    }

    @PostMapping("/add")
    public void addUserData(@RequestBody String info) {
        service.addData(info);
    }

    @DeleteMapping("/delete")
    public boolean removeData(@RequestBody String info) {
        return service.removeData(info);
    }

    @PostMapping("/replace")
    public boolean replace(@RequestBody Map<String, String> data) {
        return service.replaceData(
                data.get("old"),
                data.get("new")
        );
    }

    @DeleteMapping("/remove")
    public void removeAboutUser(@RequestBody String username) {
        service.removeAboutUser(username);
    }

    @DeleteMapping("/delete-all")
    public void deleteAll() {
        service.deleteAll();
    }

}

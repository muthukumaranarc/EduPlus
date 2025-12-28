package com.Muthu.EduPlus.Controllers;

import com.Muthu.EduPlus.Services.AboutUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/about")
public class AboutUserController {

    private final AboutUserService service;

    public AboutUserController(AboutUserService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Void> create(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String name = body.get("name");

        service.createUserData(username, name);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get")
    public ResponseEntity<List<String>> get() {
        return ResponseEntity.ok(service.getUserdata());
    }

    @PostMapping("/add")
    public ResponseEntity<Void> add(@RequestBody String info) {
        service.addData(info);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Boolean> delete(@RequestBody String info) {
        return ResponseEntity.ok(service.removeData(info));
    }

    @PutMapping("/replace")
    public ResponseEntity<Boolean> replace(@RequestBody Map<String, String> body) {

        String oldInfo = body.get("old");
        String newInfo = body.get("new");

        return ResponseEntity.ok(
                service.replaceData(oldInfo, newInfo)
        );
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> deleteProfile(@RequestBody String username) {
        service.deleteByUsername(username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<Void> deleteAll() {
        service.deleteAll();
        return ResponseEntity.ok().build();
    }
}

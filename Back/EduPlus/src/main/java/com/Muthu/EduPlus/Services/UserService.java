package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Repositories.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepo data;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private AboutUserService aboutUserService;

    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserService(@Lazy AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public ResponseEntity<String> login(String username, String password, HttpServletResponse response) {
        if (data.findByUsername(username) != null) {
            if (encoder.matches(password, data.findByUsername(username).getPassword())) {
                String token = jwtService.generateToken(username);
                ResponseCookie cookie = giveCookie(token, response);
                return ResponseEntity
                        .ok()
                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body("Login successful!");
            }
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Login failed. Wrong password!");
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Login failed. User not exist!");
    }


    public boolean logout(HttpServletResponse response) {
        return deleteCookie(response);
    }

    private ResponseCookie giveCookie(String token, HttpServletResponse response) {
        return ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true) //https
                .path("/")
                .maxAge(Duration.ofDays(365))
                .sameSite("None")  //This line important for (security(true))
                .build();
    }

    private boolean deleteCookie(HttpServletResponse response) {
        try {
            ResponseCookie cookie = ResponseCookie.from("jwt", "")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(0)
                    .sameSite("None")
                    .build();
            response.addHeader("Set-Cookie", cookie.toString());
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    // TODO: Solve the problem in this Function (Profile picture)
    public String getProfilePictureUrl() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            // Get the user attributes from OAuth2
            String googlePic = (String) oAuth2User.getAttributes().get("picture");
            String githubPic = (String) oAuth2User.getAttributes().get("avatar_url");

            if (googlePic != null) return googlePic;
            if (githubPic != null) return githubPic;
        }

        return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    public List<User> getAllUsers() {
        return data.findAll();
    }

    public String deleteAllUsers() {
        String currentUser = jwtService.getCurrentUsername(request);
        if(currentUser.equals("admin")) {
            for(User user : data.findAll()){
                if(user.getUsername().equals(currentUser)) continue;
                data.delete(user);
            }
            aboutUserService.deleteAll();
            return "All Users deleted. Except admin";
        }
        else return "Access deaned!";
    }

    public String createUser(User user, HttpServletResponse response) {
        if(data.findByUsername(user.getUsername()) == null) {

            // Creating the user with password encoded
            String token = jwtService.generateToken(user.getUsername());
            user.setPassword(encoder.encode(user.getPassword()));
            data.save(user);

            // Create the about user
            aboutUserService.createUserData(user.getUsername(), user.getFirstName());

            // Send back the auth cookie
            ResponseCookie cookie = giveCookie(token, response);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return "New user created!";
        }
        return "Failed. User already exist!";
    }

    public boolean deleteUser(HttpServletResponse response) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            data.deleteById(username);
            aboutUserService.removeAboutUser(username);
            return deleteCookie(response);
        }
        catch (Exception e) {
            return false;
        }
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = data.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Spring Security User
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword() != null ? user.getPassword() : "", // empty password for OAuth users
                Collections.emptyList() // roles/authorities (empty for now)
        );
    }

    public String deleteUserByUsername(String username) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if(currentUsername.equals("admin")) {
            data.deleteById(username);
            aboutUserService.removeAboutUser(username);
            return "User deleted!";
        }
        return "Access deaned!";
    }

    public String getUsernames(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }


    // Update functions

    private Boolean isCorrectPassword(String password) {
        return encoder.matches(password, data.findByUsername(
                        SecurityContextHolder.getContext().getAuthentication().getName())
                        .getPassword());
    }

    public String updateUsername(String usernameToChange, String password, HttpServletResponse response) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = data.findByUsername(currentUsername);

        if(isCorrectPassword(password)) {
            if (data.findByUsername(usernameToChange) == null) {

                // Change username and change the entity
                currentUser.setUsername(usernameToChange);
                data.save(currentUser);
                data.deleteById(currentUsername);

                // Re-login the user with new username
                login(usernameToChange, password, response);

                // Change the username in About user
                aboutUserService.changeUsername(usernameToChange);

                return "Username Changed!";
            }
            else return "Username already exist!";
        }
        else return "Wrong Password!";
    }

    public boolean isUserExist(String username) {
        return data.findByUsername(username) != null;
    }

    public String updatePassword(String currentPassword, String newPassword) {
        User currentUser = data.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        if(isCorrectPassword(currentPassword)) {
            currentUser.setPassword(newPassword);
            data.save(currentUser);
            return "Password Changed!";
        }
        else return "Wrong password!";
    }

    public String updateFirstname(String password, String username){
        if(isCorrectPassword(password)){
            User user = data.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            user.setFirstName(username);
            data.save(user);
            return "Username Changed!";
        }
        return "Wrong Password!";
    }

    public String updateLastname(String password, String username){
        if(isCorrectPassword(password)){
            User user = data.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            user.setLastName(username);
            data.save(user);
            return "Username Changed!";
        }
        return "Wrong Password!";
    }

    public String updateMobileNumber(String password, String mobileNumber) {
        if(isCorrectPassword(password)) {
            User user = data.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            user.setMobileNumber(mobileNumber);
            data.save(user);
            return "Mobile number Changed!";
        }
        else return "Wrong Password!";
    }

    public String UpdateMailId(String password, String mailId) {
        if(isCorrectPassword(password)) {
            User user = data.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            user.setMailId(mailId);
            data.save(user);
            return "Mail ID Changed!";
        }
        else return "Wrong Password!";
    }

    public String UpdateDOB(String password, String date) {
        LocalDate cvtDate = LocalDate.parse(date); //yyyy-mm-dd formate only
        if(isCorrectPassword(password)) {
            User user = data.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            user.setDob(cvtDate);
            data.save(user);
            return "DOB Changed!";
        }
        else return "Wrong Password!";
    }

}

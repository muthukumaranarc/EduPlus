package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.Friends;
import com.Muthu.EduPlus.Models.Gender;
import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Repositories.FriendsRepo;
import com.Muthu.EduPlus.Repositories.TracksRepo;
import com.Muthu.EduPlus.Repositories.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
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

    @Autowired
    private FriendsService friendsService;

    @Autowired
    private ProgressTrackerService progressTrackerService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public ResponseEntity<String> login(String username, String password, HttpServletResponse response) {
        if (data.findByUsername(username) != null) {
            if (encoder.matches(password, data.findByUsername(username).getPassword())) {
                String token = jwtService.generateToken(username);
                ResponseCookie cookie = giveCookie(token);
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

    private ResponseCookie giveCookie(String token) {
        return ResponseCookie.from("auth", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(30))
                .sameSite("Lax")
                .build();
    }


    private boolean deleteCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("auth", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return true;
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

    public User getCurrentUserData() {
        String username = getUsernames();

        if (username == null) {
            return null;
        }

        return data.findByUsername(username);
    }

    public User getUserByUsername(String username) {
        User userData = data.findByUsername(username);
        userData.setGender(null);
        userData.setMobileNumber(null);
        userData.setPassword(null);
        return userData;
    }

    public String deleteAllUsers() {
        String currentUser = jwtService.getCurrentUsername(request);
        System.out.println(currentUser);
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

            // Create requirements
            aboutUserService.createUserData(user.getUsername(), user.getFirstName());
            friendsService.createUser(user.getUsername());
            progressTrackerService.createTrack(user.getFirstName(), "Today task");

            // Send back the auth cookie
            ResponseCookie cookie = giveCookie(token);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return "New user created!";
        }
        return "Failed. User already exist!";
    }

    public boolean updateUserOAuth(User user){
        try {
            User userData = data.findByUsername(user.getUsername());

            userData.setFirstName(user.getFirstName());
            userData.setLastName(user.getLastName());
            userData.setTrophy(user.getTrophy());
            userData.setDob(user.getDob());
            userData.setMailId(user.getMailId());
            userData.setLinkedIn(user.getLinkedIn());
            userData.setMobileNumber(user.getMobileNumber());
            userData.setGender(user.getGender());

            data.save(userData);

            // Create requirements
            aboutUserService.createUserData(user.getUsername(), user.getFirstName());
            friendsService.createUser(user.getUsername());
            progressTrackerService.createTrack(user.getFirstName(), "Today task");

            return true;
        }
        catch (Exception e) {
            return false;
        }
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

    public String getUsernames() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null ||
                !auth.isAuthenticated() ||
                auth instanceof AnonymousAuthenticationToken) {
            return null;
        }

        return auth.getName();
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
            currentUser.setPassword(encoder.encode(newPassword));
            data.save(currentUser);
            return "Password Changed!";
        }
        else return "Wrong password!";
    }

    public String updateFirstname(String password, String username){
        String correctUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if(isCorrectPassword(password) || correctUser.contains("@")){
            User user = data.findByUsername(correctUser);
            user.setFirstName(username);
            data.save(user);
            return "Username Changed!";
        }
        return "Wrong Password!";
    }

    public String updateLastname(String password, String username){
        String correctUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if(isCorrectPassword(password) || correctUser.contains("@")){
            User user = data.findByUsername(correctUser);
            user.setLastName(username);
            data.save(user);
            return "Username Changed!";
        }
        return "Wrong Password!";
    }

    public String updateMobileNumber(String password, String mobileNumber) {
        String correctUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if(isCorrectPassword(password) || correctUser.contains("@")) {
            User user = data.findByUsername(correctUser);
            user.setMobileNumber(mobileNumber);
            data.save(user);
            return "Mobile number Changed!";
        }
        else return "Wrong Password!";
    }

    public String UpdateMailId(String password, String mailId) {
        String correctUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if(isCorrectPassword(password) || correctUser.contains("@")) {
            User user = data.findByUsername(correctUser);
            user.setMailId(mailId);
            data.save(user);
            return "Mail ID Changed!";
        }
        else return "Wrong Password!";
    }

    public String UpdateDOB(String password, String date) {
        String correctUser = SecurityContextHolder.getContext().getAuthentication().getName();
        LocalDate cvtDate = LocalDate.parse(date); //yyyy-mm-dd formate only
        if(isCorrectPassword(password) || correctUser.contains("@")) {
            User user = data.findByUsername(correctUser);
            user.setDob(cvtDate);
            data.save(user);
            return "DOB Changed!";
        }
        else return "Wrong Password!";
    }

    public String updateGender(String password, String gender) {
        String correctUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if(isCorrectPassword(password) || correctUser.contains("@")) {
            User user = data.findByUsername(correctUser);
            user.setGender(gender);
            data.save(user);
            return "Gender Changed!";
        }
        else return "Wrong Password!";
    }

    public String updateLinkedIn(String password, String linkedIn) {
        String correctUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if(isCorrectPassword(password) || correctUser.contains("@")) {
            User user = data.findByUsername(correctUser);
            user.setLinkedIn(linkedIn);
            data.save(user);
            return "LinkedIn Changed!";
        }
        else return "Wrong Password!";
    }

    public void sumTrophiesToCurrentUser(boolean toAdd, Integer trophyToSum){
        User user = data.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        Integer currentTrophies = user.getTrophy();
        if (toAdd) currentTrophies = currentTrophies + trophyToSum;
        else currentTrophies = currentTrophies - trophyToSum;
        user.setTrophy(currentTrophies);
        data.save(user);
    }

    public void updateFriends(){
        User currentUser = data.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        currentUser.setFriends(
                friendsService.
                        getCurrentUser().
                        getFriends().
                        size()
        );
    }
}

package com.Muthu.EduPlus.Services;

import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Repositories.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {

    private final UserRepo data;
    private final JwtService jwtService;
    private final AboutUserService aboutUserService;
    private final FriendsService friendsService;
    private final GrammarService grammarService;
    private final ProgressTrackerService progressTrackerService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserService(
            UserRepo data,
            JwtService jwtService,
            AboutUserService aboutUserService,
            FriendsService friendsService,
            GrammarService grammarService,
            ProgressTrackerService progressTrackerService) {
        this.data = data;
        this.jwtService = jwtService;
        this.aboutUserService = aboutUserService;
        this.friendsService = friendsService;
        this.grammarService = grammarService;
        this.progressTrackerService = progressTrackerService;
    }

    public ResponseEntity<String> login(String username, String password, HttpServletResponse response) {
        User user = data.findByUsername(username);
        if (user != null && encoder.matches(password, user.getPassword())) {
            String token = jwtService.generateToken(username);
            response.addHeader(HttpHeaders.SET_COOKIE, giveCookie(token).toString());
            return ResponseEntity.ok("Login successful!");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed!");
    }

    public boolean logout(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie().toString());
        return true;
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

    private ResponseCookie deleteCookie() {
        return ResponseCookie.from("auth", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
    }

    public String createUser(User user, HttpServletResponse response) {
        if (data.findByUsername(user.getUsername()) != null)
            return "User already exist!";

        user.setPassword(encoder.encode(user.getPassword()));
        data.save(user);

        aboutUserService.createUserData(user.getUsername(), user.getFirstName());
        friendsService.createUser(user.getUsername());
        progressTrackerService.createTrack(
                user.getUsername());

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                giveCookie(jwtService.generateToken(user.getUsername())).toString());

        return "New user created!";
    }

    public boolean updateUserOAuth(User user) {
        User existing = data.findByUsername(user.getUsername());
        if (existing == null)
            return false;

        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setDob(user.getDob());
        existing.setMailId(user.getMailId());
        existing.setLinkedIn(user.getLinkedIn());
        existing.setMobileNumber(user.getMobileNumber());
        existing.setGender(user.getGender());
        existing.setTrophy(user.getTrophy());

        // Update profile picture if provided (for basic auth users)
        if (user.getProfilePicture() != null && !user.getProfilePicture().isBlank()) {
            existing.setProfilePicture(user.getProfilePicture());
        }

        data.save(existing);

        aboutUserService.createUserData(user.getUsername(), user.getFirstName());
        friendsService.createUser(user.getUsername());
        progressTrackerService.createTrack("Today task");

        return true;
    }

    public List<User> getAllUsers() {
        return data.findAll();
    }

    public User getCurrentUserData() {
        String username = getUsernames();
        return username == null ? null : data.findByUsername(username);
    }

    public User getUserByUsername(String username) {
        User user = data.findByUsername(username);
        if (user == null)
            return null;

        user.setPassword(null);
        user.setMobileNumber(null);
        return user;
    }

    public boolean isUserExist(String username) {
        return data.findByUsername(username) != null;
    }

    private void deleteAllActivity(String username) {
        aboutUserService.deleteByUsername(username);
        friendsService.deleteUser(username);
        progressTrackerService.deleteTrack(username);
        grammarService.deleteUser(username);
    }

    public boolean deleteUser(HttpServletResponse response) {

        String username = getUsernames();
        if (username == null)
            return false;

        User user = data.findByUsername(username);
        if (user == null)
            return false;

        data.delete(user);

        deleteAllActivity(username);

        SecurityContextHolder.clearContext();
        response.addHeader(
                HttpHeaders.SET_COOKIE,
                deleteCookie().toString());

        return true;
    }

    public String deleteUserByUsername(String username) {
        if (!"admin".equals(getUsernames()))
            return "Access denied!";
        User user = data.findByUsername(username);
        if (user == null)
            return "User not found";

        data.delete(user);

        deleteAllActivity(username);

        return "User deleted!";
    }

    public String deleteAllUsers() {
        if (!"admin".equals(getUsernames()))
            return "Access denied!";
        data.deleteAll();
        aboutUserService.deleteAll();
        return "All users deleted!";
    }

    public String updateUsername(String newUsername, String password, HttpServletResponse response) {

        String currentUsername = getUsernames();
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        if (data.findByUsername(newUsername) != null)
            return "Username already exist!";

        User userData = data.findByUsername(currentUsername);

        data.deleteById(currentUsername);

        userData.setUsername(newUsername);
        data.save(userData);

        aboutUserService.updateUsernameByOldUsername(currentUsername, newUsername);
        progressTrackerService.changeUsernameTrack(currentUsername, newUsername);
        friendsService.changeUsername(newUsername);
        grammarService.updateUsername(currentUsername, newUsername);

        login(newUsername, password, response);

        return "Username Changed!";
    }

    public String updatePassword(String currentPassword, String newPassword) {
        if (!isCorrectPassword(currentPassword))
            return "Wrong password!";
        User user = data.findByUsername(getUsernames());
        user.setPassword(encoder.encode(newPassword));
        data.save(user);
        return "Password Changed!";
    }

    public String updateFirstname(String password, String firstname) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setFirstName(firstname);
        data.save(user);
        return "Firstname Changed!";
    }

    public String updateLastname(String password, String lastname) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setLastName(lastname);
        data.save(user);
        return "Lastname Changed!";
    }

    public String updateMobileNumber(String password, String mobileNumber) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setMobileNumber(mobileNumber);
        data.save(user);
        return "Mobile number Changed!";
    }

    public String UpdateMailId(String password, String mailId) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setMailId(mailId);
        data.save(user);
        return "Mail ID Changed!";
    }

    public String UpdateDOB(String password, String date) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setDob(LocalDate.parse(date));
        data.save(user);
        return "DOB Changed!";
    }

    public String updateGender(String password, String gender) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setGender(gender);
        data.save(user);
        return "Gender Changed!";
    }

    public String updateLinkedIn(String password, String linkedIn) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setLinkedIn(linkedIn);
        data.save(user);
        return "LinkedIn Changed!";
    }

    public String updateProfilePicture(String password, String profilePicture) {
        if (!isCorrectPassword(password))
            return "Wrong Password!";
        User user = data.findByUsername(getUsernames());
        user.setProfilePicture(profilePicture);
        data.save(user);
        return "Profile Picture Changed!";
    }

    public void sumTrophiesToCurrentUser(boolean add, Integer trophies) {
        User user = data.findByUsername(getUsernames());
        user.setTrophy(add ? user.getTrophy() + trophies : user.getTrophy() - trophies);
        data.save(user);
    }

    public void updateFriends() {
        User user = data.findByUsername(getUsernames());
        user.setFriends(
                friendsService.getCurrentUser().getFriends().size());
        data.save(user);
    }

    private boolean isCorrectPassword(String password) {
        User user = data.findByUsername(getUsernames());
        return user != null && encoder.matches(password, user.getPassword());
    }

    public String getUsernames() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken)
            return null;
        return auth.getName();
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = data.findByUsername(username);
        if (user == null)
            throw new UsernameNotFoundException("User not found");

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList());
    }
}

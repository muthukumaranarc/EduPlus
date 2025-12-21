package com.Muthu.EduPlus.Configurations;

import com.Muthu.EduPlus.Models.AboutUser;
import com.Muthu.EduPlus.Models.Friends;
import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Repositories.UserRepo;
import com.Muthu.EduPlus.Services.AboutUserService;
import com.Muthu.EduPlus.Services.FriendsService;
import com.Muthu.EduPlus.Services.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepo users;

    @Autowired
    private AboutUserService aboutUserService;

    @Autowired
    private FriendsService friendsService;

    public OAuth2SuccessHandler(JwtService jwtService, UserRepo users) {
        this.jwtService = jwtService;
        this.users = users;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String username = (email != null)
                ? email
                : oAuth2User.getAttribute("login"); // GitHub
        boolean needToGetUserInformation = false;

        // Create user if not exists
        User user = users.findByUsername(username);
        if (user == null) {
            // Create user
            user = new User();
            user.setUsername(username);
            user.setFirstName(username.split("@")[0]);
            user.setMailId(email);
            users.save(user);
            needToGetUserInformation = true;
        }

        // Generate JWT
        String token = jwtService.generateToken(username);

        // SAME cookie config as everywhere else
        ResponseCookie cookie = ResponseCookie.from("auth", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(30))
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Redirect to React app
        if(needToGetUserInformation)
            response.sendRedirect("http://localhost:5173/get-info-oauth");
        else
            response.sendRedirect("http://localhost:5173/home");

    }
}

package com.Muthu.EduPlus.Configurations;

import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Repositories.UserRepo;
import com.Muthu.EduPlus.Services.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private static final String AUTH_COOKIE_NAME = "auth";
    private static final long COOKIE_DAYS = 30;

    private final JwtService jwtService;
    private final UserRepo userRepo;

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    @Value("${app.cookie.samesite:Lax}")
    private String sameSite;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2SuccessHandler(JwtService jwtService, UserRepo userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String username = (email != null && !email.isBlank())
                ? email
                : oAuth2User.getAttribute("login"); // GitHub fallback

        // Extract profile picture from OAuth2 provider
        String profilePictureUrl = oAuth2User.getAttribute("picture"); // Google profile picture

        boolean isNewUser = false;

        User user = userRepo.findByUsername(username);
        if (user == null) {
            user = new User();
            user.setUsername(username);
            user.setFirstName(username.contains("@")
                    ? username.split("@")[0]
                    : username);
            user.setMailId(email);
            user.setProfilePicture(profilePictureUrl); // Set profile picture for new OAuth2 users
            userRepo.save(user);
            isNewUser = true;
        } else {
            // Update profile picture for existing OAuth2 users if available
            if (profilePictureUrl != null && !profilePictureUrl.isBlank()) {
                user.setProfilePicture(profilePictureUrl);
                userRepo.save(user);
            }
        }

        // 🔐 Generate JWT
        String token = jwtService.generateToken(username);

        // 🍪 Build cookie depending on environment
        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie
                .from(AUTH_COOKIE_NAME, token)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(COOKIE_DAYS));

        if (secureCookie) {
            cookieBuilder.secure(true);
        }

        cookieBuilder.sameSite(sameSite);

        ResponseCookie cookie = cookieBuilder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 🔄 Redirect user
        if (isNewUser) {
            response.sendRedirect(frontendUrl + "/get-info-oauth");
        } else {
            response.sendRedirect(frontendUrl + "/home");
        }
    }
}
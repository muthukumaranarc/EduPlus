package com.Muthu.EduPlus.Configurations;

import com.Muthu.EduPlus.Models.User;
import com.Muthu.EduPlus.Repositories.UserRepo;
import com.Muthu.EduPlus.Services.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

        boolean isNewUser = false;

        User user = userRepo.findByUsername(username);
        if (user == null) {
            user = new User();
            user.setUsername(username);
            user.setFirstName(username.contains("@")
                    ? username.split("@")[0]
                    : username);
            user.setMailId(email);
            userRepo.save(user);
            isNewUser = true;
        }

        // Generate JWT
        String token = jwtService.generateToken(username);

        // HttpOnly Auth Cookie
        ResponseCookie cookie = ResponseCookie.from(AUTH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false) // << MUST be true in production (HTTPS)
                .path("/")
                .maxAge(Duration.ofDays(COOKIE_DAYS))
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Redirect to frontend
        if (isNewUser) {
            response.sendRedirect("http://localhost:5173/get-info-oauth");
        } else {
            response.sendRedirect("http://localhost:5173/home");
        }
    }
}

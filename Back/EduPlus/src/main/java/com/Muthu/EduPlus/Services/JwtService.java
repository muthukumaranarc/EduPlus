package com.Muthu.EduPlus.Services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // 32+ chars (256-bit key for HS256)
    private static final String SECURITY_KEY =
            "MuthuEduPlusSuperSecureJwtSigningKey2025@#123";

    // Centralized expiry (30 days)
    private static final long JWT_EXPIRATION_MS =
            1000L * 60 * 60 * 24 * 30;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECURITY_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(getKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return claims != null ? resolver.apply(claims) : null;
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return null; // fail safely
        }
    }

    public String getTokenFromRequest(HttpServletRequest request) {

        // Authorization header (optional)
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }

        // HttpOnly cookie (MAIN)
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("auth".equals(c.getName())) {
                    return c.getValue();
                }
            }
        }

        return null;
    }

    public String getCurrentUsername(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        return token != null ? extractUsername(token) : null;
    }
}

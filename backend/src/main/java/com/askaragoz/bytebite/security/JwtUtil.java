package com.askaragoz.bytebite.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String generateToken(String username){
        return Jwts.builder().subject(username).signWith(getKey())
                .expiration(new Date(System.currentTimeMillis() + expiration)).compact();
    }

    public String extractUsername(String token){
        return Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token)
                .getPayload().getSubject();
    }

    public Boolean isTokenValid(String token, String userName){
        boolean isUsernameValid = Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload().getSubject().equals(userName);

        boolean isTokenExpired = Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload().getExpiration().before(new java.util.Date());

        return isUsernameValid && !isTokenExpired;
    }
}

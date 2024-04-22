package austral.ing.lab1;

import java.util.Base64;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class TokenManager {

    private static final Key JWT_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private static final Set<String> blacklistedTokens = new HashSet<>();

    public static String generateToken(String email, String userType){

        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("userType", userType);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(JWT_SECRET_KEY)
            .compact();
    }

    public static String getUserEmail(String token) {

        try {
            System.out.println("Secret key: " + Base64.getEncoder().encodeToString(JWT_SECRET_KEY.getEncoded()));
            System.out.println("Token: " + token);
            return Jwts.parserBuilder().setSigningKey(JWT_SECRET_KEY).build().parseClaimsJws(token).getBody().get("email", String.class);
        } catch (Exception e) {
            System.out.println("Error al decodificar el token: " + e.getMessage());
            return null;
        }

    }

    public static boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public static void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    public static String getUserType(String token) {
        return Jwts.parserBuilder().setSigningKey(JWT_SECRET_KEY).build().parseClaimsJws(token).getBody().get("userType", String.class);
    }



    public static boolean isAuthorized(String token, String requestedEmail) {

        System.out.println("Token recibido: " + token);


        // Verificar si el token está en la lista negra
        if (isTokenBlacklisted(token)) {
            return false;
        }

        // Obtener el correo electrónico asociado al token
        String userEmail = getUserEmail(token);

        // Verificar si el correo electrónico obtenido está vacío o nulo
        if (userEmail == null || userEmail.isEmpty()) {
            return false;
        }

        // Verificar si el correo electrónico del token coincide con el correo solicitado
        return userEmail.equals(requestedEmail);
    }
}


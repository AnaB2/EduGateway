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
            // Remover el prefijo "Bearer " si está presente
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
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
        // Remover el prefijo "Bearer " si está presente
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        return Jwts.parserBuilder().setSigningKey(JWT_SECRET_KEY).build().parseClaimsJws(token).getBody().get("userType", String.class);
    }

    public static boolean isAuthorized(String token, String requestedEmail) {

        System.out.println("===== AUTHORIZATION DEBUG START =====");
        System.out.println("Token recibido: " + token);
        System.out.println("Email solicitado: " + requestedEmail);

        // Remover el prefijo "Bearer " si está presente
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            System.out.println("Token sin Bearer: " + token);
        } else {
            System.out.println("Token no tiene prefijo Bearer");
        }

        // Verificar si el token está en la lista negra
        if (isTokenBlacklisted(token)) {
            System.out.println("Token está en la lista negra");
            return false;
        }
        System.out.println("Token no está en lista negra");

        try {
            String userEmail = getUserEmail(token);
            System.out.println("Email extraído del token: " + userEmail);

            // Verificar si el correo electrónico obtenido está vacío o nulo
            if (userEmail == null || userEmail.isEmpty()) {
                System.out.println("Email del token es null o vacío");
                return false;
            }

            // Verificar si el correo electrónico del token coincide con el correo solicitado
            boolean emailsMatch = userEmail.equals(requestedEmail);
            System.out.println("¿Emails coinciden? " + emailsMatch + " (token: '" + userEmail + "' vs solicitado: '" + requestedEmail + "')");
            
            System.out.println("===== AUTHORIZATION DEBUG END =====");
            return emailsMatch;
            
        } catch (Exception e) {
            System.out.println("Error durante autorización: " + e.getMessage());
            e.printStackTrace();
            System.out.println("===== AUTHORIZATION DEBUG END =====");
            return false;
        }
    }
}


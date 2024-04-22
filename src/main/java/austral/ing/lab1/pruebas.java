package austral.ing.lab1;




public class pruebas {
  public static void main(String[] args) {
    TokenManager tokenManager = new TokenManager();
    String token = tokenManager.generateToken("utn@gmail.com", "institucion");

    String email = TokenManager.getUserEmail(token);
    System.out.println(token);
    System.out.println(email);








  }



}

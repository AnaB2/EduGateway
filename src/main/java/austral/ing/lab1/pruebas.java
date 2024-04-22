package austral.ing.lab1;


public class pruebas {
  public static void main(String[] args) {
    TokenManager tokenManager = new TokenManager();
    String token = tokenManager.generateToken("utn@gmail.com", "institucion");
    System.out.println(token);








  }



}

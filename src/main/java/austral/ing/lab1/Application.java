package austral.ing.lab1;

import austral.ing.lab1.authentication.LoginController;
import austral.ing.lab1.authentication.LogoutController;
import austral.ing.lab1.authentication.RegisterController;
import com.google.gson.Gson;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import spark.Spark;


public class Application {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static void main(String[] args) {
        Spark.port(4321);

        Spark.options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        Spark.before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "http://localhost:8081");
            response.header("Access-Control-Allow-Credentials", "true");
        });



        Spark.post("/sign-up-user", RegisterController.handleRegisterParticipant);

        Spark.post("/log-in", LoginController.handleLogin);
//        Spark.post("/edit-user", LoginController.handleLogin);

        Spark.post("/log-out-user", LogoutController.handleLogout);

        Spark.post("/sign-up-institution", RegisterController.handleRegisterInstitution);



    }
}



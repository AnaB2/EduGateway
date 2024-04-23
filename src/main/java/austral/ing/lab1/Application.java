package austral.ing.lab1;

import static austral.ing.lab1.controllers.OpportunityController.handleGetOpportunities;
import static austral.ing.lab1.controllers.OpportunityController.handleGetOpportunitiesByEmail;

import austral.ing.lab1.controllers.InscriptionController;
import austral.ing.lab1.controllers.LoginController;
import austral.ing.lab1.controllers.LogoutController;
import austral.ing.lab1.controllers.OpportunityController;
import austral.ing.lab1.controllers.SignupController;
import com.google.gson.Gson;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import spark.Spark;


public class Application {

    private static final Gson gson = new Gson();
    //
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

        Spark.post("/sign-up-user", SignupController.handleRegisterParticipant);

        Spark.post("/sign-up-institution", SignupController.handleRegisterInstitution);

        Spark.post("/log-in", LoginController.handleLogin);

        Spark.post("/log-out-user", LogoutController.handleLogout);

        Spark.post("/add-opportunity", OpportunityController.handleAddOpportunity);

        Spark.post("/delete-opportunity", OpportunityController.handleDeleteOpportunity);

        Spark.post("/edit-opportunity", OpportunityController.handleEditOpportunity);

        Spark.get("/get-opportunities", handleGetOpportunities);

        Spark.get("/get-opportunities-institution", handleGetOpportunitiesByEmail);

        Spark.post("/add-inscription", InscriptionController.handleInscription);

        Spark.post("/approve-inscription", InscriptionController.handleAcceptInscription);

        Spark.post("/reject-inscription", InscriptionController.handleRejectInscription);





    }
}

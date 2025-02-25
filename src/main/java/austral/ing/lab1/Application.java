package austral.ing.lab1;
import static austral.ing.lab1.controllers.OpportunityController.handleGetOpportunities;
import static austral.ing.lab1.controllers.OpportunityController.handleGetOpportunitiesByEmail;
import austral.ing.lab1.controllers.*;
import austral.ing.lab1.repository.NotificationEndpoint;
import com.google.gson.Gson;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import spark.Spark;
import static spark.Spark.webSocket;

public class Application {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static void main(String[] args) {
        Spark.port(4321);

        // Configurar el endpoint de WebSocket antes de las rutas HTTP
        webSocket("/notifications", NotificationEndpoint.class);

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

        Spark.post("/sign-up-user", SignupController.handleSignupUser);

        Spark.post("/sign-up-institution", SignupController.handleSignupInstitution);

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

        Spark.get("/get-inscriptions", InscriptionController.handleShowInscriptions);

        Spark.post("/follow-institution", UserController.handleFollowInstitution);

        Spark.post("/unfollow-institution", UserController.handleUnfollowInstitution);

        Spark.post("/edit-user", UserController.handleEditUser);

        Spark.post("/edit-institution", InstitutionController.handleEditInstitution);

        Spark.get("/get-user-data", UserController.handleGetUserData);

        Spark.get("/get-institution-data", InstitutionController.handleGetInstitutionData);

        Spark.get("/filter-by-category", FilterController.FilterByCategory);

        Spark.get("/filter-by-nameOpportunity", FilterController.FilterByNameOpportunity);

        Spark.get("/filter-by-InstitutionName", FilterController.FilterByNameInstitution);

        Spark.post("/delete-user", UserController.handleDeleteUser);

        Spark.post("/delete-institution", InstitutionController.handleDeleteInstitution);

        Spark.get("/get-followed-institutions-by-user/:userId", UserController.handleGetFollowedInstitutionsByUser);

        Spark.get("/get-institution-followers/:institutionId", UserController.handleGetFollowersByInstitution);

        Spark.post("/create-chat", ChatController.handleCreateChat);

        Spark.post("/send-message", ChatController.handleSendMessage);

        Spark.post("/get-chat-messages", ChatController.handleGetChatMessages);

        Spark.get("/get-institution-history", InstitutionController.handleGetInstitutionHistory);

        Spark.get("/get-user-history", UserController.handleGetUserHistory);

        Spark.post("/create-preference", MercadoPagoController.handleCreatePreference);
    }
}

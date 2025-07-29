package austral.ing.lab1;
import static austral.ing.lab1.controllers.OpportunityController.handleGetOpportunities;
import static austral.ing.lab1.controllers.OpportunityController.handleGetOpportunitiesByEmail;
import austral.ing.lab1.controllers.*;
import austral.ing.lab1.persistence.Database;
import austral.ing.lab1.repository.NotificationEndpoint;
import austral.ing.lab1.util.EntityManagers;
import com.google.gson.Gson;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import spark.Spark;
import austral.ing.lab1.controllers.NotificationController;

public class Application {

    private static final Gson gson = new Gson();
    // Removemos la línea problemática que creaba el EMF estáticamente
    // private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static void main(String[] args) {
        System.out.println("=== Starting EduGateway Backend ===");
        
        // Paso 1: Iniciar la base de datos primero
        System.out.println("Step 1: Starting HSQLDB database...");
        Database database = new Database();
        database.startDBServer();
        
        // Paso 2: Esperar a que la base de datos esté lista
        System.out.println("Step 2: Waiting for database to initialize...");
        try {
            Thread.sleep(5000); // Esperar 5 segundos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Paso 3: Crear el EntityManagerFactory DESPUÉS de que la BD esté lista
        System.out.println("Step 3: Creating EntityManagerFactory...");
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");
        
        // Paso 4: Configurar EntityManagers para que todos los controladores lo usen
        EntityManagers.setFactory(entityManagerFactory);
        
        // Paso 5: Agregar shutdown hook para cerrar todo limpiamente
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutting down application...");
            if (entityManagerFactory != null && entityManagerFactory.isOpen()) {
                entityManagerFactory.close();
            }
            database.stopDBServer();
        }));
        
        // Paso 6: Configurar Spark
        System.out.println("Step 4: Starting Spark server on port 4321...");
        Spark.port(4321);

        // Configurar WebSocket ANTES de las rutas HTTP
        System.out.println("Step 5: Configuring WebSocket endpoint...");
        Spark.webSocket("/notifications", NotificationEndpoint.class);

        // Firebase notifications will replace WebSocket functionality

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

        Spark.get("/get-opportunities", OpportunityController.handleGetOpportunities);

        Spark.get("/get-opportunities-institution", OpportunityController.handleGetOpportunitiesByEmail);

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

        Spark.get("/filter-opportunities", FilterController.FilterOpportunities);

        Spark.post("/delete-user", UserController.handleDeleteUser);

        Spark.post("/delete-institution", InstitutionController.handleDeleteInstitution);

        Spark.get("/get-followed-institutions-by-user/:userId", UserController.handleGetFollowedInstitutionsByUser);

        Spark.get("/get-institution-followers/:institutionId", UserController.handleGetFollowersByInstitution);

        Spark.post("/create-chat", ChatController.handleCreateChat);

        Spark.post("/send-message", ChatController.handleSendMessage);

        Spark.post("/get-chat-messages", ChatController.handleGetChatMessages);
        
        Spark.post("/get-messages-by-chat", ChatController.handleGetMessagesByChat);

        Spark.get("/get-institution-history", InstitutionController.handleGetInstitutionHistory);

        Spark.get("/get-user-history", UserController.handleGetUserHistory);

        Spark.post("/create-preference", MercadoPagoController.handleCreatePreference);

        Spark.post("/donations", DonationController.handleCreateDonation);

        Spark.get("/donations/:id", DonationController.handleGetDonationById);

        Spark.get("/donations", DonationController.handleGetAllDonations);

        Spark.get("/donations/user/:userId", DonationController.handleGetDonationsByUser);

        Spark.get("/donations/institution/:institutionId", DonationController.handleGetDonationsByInstitution);

        Spark.delete("/donations/:id", DonationController.handleDeleteDonation);

        Spark.get("/recommended-opportunities", OpportunityController.getRecommendedOpportunities);

        Spark.post("/update-user-tags", UserController.updateUserTags);
        
        // 🔔 Notification endpoints
        Spark.get("/notifications/user", NotificationController.handleGetUserNotifications);
        Spark.get("/notifications/institution", NotificationController.handleGetInstitutionNotifications);
        Spark.get("/notifications/unread-count", NotificationController.handleGetUnreadCount);
        Spark.post("/notifications/mark-read", NotificationController.handleMarkAsRead);
        Spark.post("/notifications/mark-all-read", NotificationController.handleMarkAllAsRead);
        
        System.out.println("============================================");
        System.out.println("✅ EduGateway Backend is running!");
        System.out.println("🌐 Server: http://localhost:4321");
        System.out.println("🗄️  Database: HSQLDB running");
        System.out.println("⏹️  Press Ctrl+C to stop");
        System.out.println("============================================");
    }
}

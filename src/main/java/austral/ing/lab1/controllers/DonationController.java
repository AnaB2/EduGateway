package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Donation;
import austral.ing.lab1.model.DonationDTO;
import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.Notification;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Donations;
import austral.ing.lab1.repository.NotificationService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class DonationController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    // Crear donación
    public static Route handleCreateDonation = (Request request, Response response) -> {
        System.out.println("Recibiendo solicitud para crear donación...");

        String body = request.body();
        System.out.println("Request Body: " + body);

        Map<String, String> formData;
        try {
            formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());
        } catch (Exception e) {
            System.err.println("Error al parsear el JSON: " + e.getMessage());
            response.status(400);
            return "{\"error\": \"Invalid JSON format\"}";
        }

        if (!formData.containsKey("userId") || !formData.containsKey("institutionId") || !formData.containsKey("amount") ||
                formData.get("userId") == null || formData.get("institutionId") == null || formData.get("amount") == null ||
                formData.get("userId").trim().isEmpty() || formData.get("institutionId").trim().isEmpty() || formData.get("amount").trim().isEmpty()) {

            System.err.println("Campos faltantes o vacíos en la solicitud.");
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        Long userId;
        Long institutionId;
        BigDecimal amount;

        try {
            userId = Long.parseLong(formData.get("userId"));
            institutionId = Long.parseLong(formData.get("institutionId"));
            amount = new BigDecimal(formData.get("amount"));

            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                System.err.println("Error: El monto de donación debe ser mayor a 0.");
                response.status(400);
                return "{\"error\": \"Amount must be greater than 0\"}";
            }
        } catch (NumberFormatException e) {
            System.err.println("Error al convertir los valores: " + e.getMessage());
            response.status(400);
            return "{\"error\": \"Invalid number format for userId, institutionId, or amount\"}";
        }

        System.out.println("Datos recibidos correctamente:");
        System.out.println("   Usuario ID: " + userId);
        System.out.println("   Institución ID: " + institutionId);
        System.out.println("   Monto: " + amount);

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Donations donationRepository = new Donations(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            System.out.println("Buscando usuario...");
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                System.err.println("Usuario no encontrado.");
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            System.out.println("Buscando institución...");
            Institution institution = entityManager.find(Institution.class, institutionId);
            if (institution == null) {
                System.err.println("Institución no encontrada.");
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            tx.begin();
            System.out.println("Guardando donación en la base de datos...");
            Donation donation = new Donation(user, institution, amount, LocalDateTime.now());
            donationRepository.persist(donation);
            System.out.println("Donación persistida en memoria.");
            tx.commit();

            // Notificar a la institución sobre la nueva donación
            try {
                NotificationService notificationService = new NotificationService(entityManager);
                String message = "Has recibido una nueva donación. " + 
                               user.getFirstName() + " " + user.getLastName() + 
                               " te donó $" + amount + ". Gracias por tu labor.";
                
                Notification notification = new Notification(message, institution.getId(), null);
                notificationService.sendNotification(notification);
                System.out.println("Notificación de donación enviada a: " + institution.getInstitutionalName());
            } catch (Exception e) {
                System.err.println("Error enviando notificación de donación: " + e.getMessage());
                // No fallar la operación principal por un error de notificación
            }

            System.out.println("Donación creada exitosamente con ID: " + donation.getId());
            response.type("application/json");
            return gson.toJson(Map.of("message", "Donation created successfully", "donationId", donation.getId()));

        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            System.err.println("Error al crear la donación: " + e.getMessage());
            e.printStackTrace();
            response.status(500);
            return "{\"error\": \"Internal Server Error: " + e.getMessage() + "\"}";
        } finally {
            entityManager.close();
        }
    };

    // Obtener donación por ID
    public static Route handleGetDonationById = (Request request, Response response) -> {
        Long donationId = Long.parseLong(request.params(":id"));

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Donations donationRepository = new Donations(entityManager);

        try {
            Optional<Donation> donation = donationRepository.findById(donationId);
            if (donation.isEmpty()) {
                response.status(404);
                return "{\"error\": \"Donation not found\"}";
            }

            response.type("application/json");
            return gson.toJson(donation.get());
        } finally {
            entityManager.close();
        }
    };

    // Obtener todas las donaciones
    public static Route handleGetAllDonations = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Donations donationRepository = new Donations(entityManager);

        try {
            List<Donation> donations = donationRepository.listAll();
            response.type("application/json");
            return gson.toJson(donations);
        } finally {
            entityManager.close();
        }
    };

    // Obtener donaciones de un usuario específico
    public static Route handleGetDonationsByUser = (Request request, Response response) -> {
        Long userId = Long.parseLong(request.params(":userId"));

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Donations donationRepository = new Donations(entityManager);

        try {
            List<DonationDTO> donations = donationRepository.findByUserId(userId);
            response.type("application/json");
            return gson.toJson(donations);
        } finally {
            entityManager.close();
        }
    };

    // Obtener donaciones para una institución específica
    public static Route handleGetDonationsByInstitution = (Request request, Response response) -> {
        Long institutionId = Long.parseLong(request.params(":institutionId"));

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Donations donationRepository = new Donations(entityManager);

        try {
            List<DonationDTO> donations = donationRepository.findByInstitutionId(institutionId);
            response.type("application/json");
            return gson.toJson(donations);
        } finally {
            entityManager.close();
        }
    };

    // Eliminar donación
    public static Route handleDeleteDonation = (Request request, Response response) -> {
        Long donationId = Long.parseLong(request.params(":id"));

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Donations donationRepository = new Donations(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            Optional<Donation> donation = donationRepository.findById(donationId);
            if (donation.isEmpty()) {
                response.status(404);
                return "{\"error\": \"Donation not found\"}";
            }

            donationRepository.delete(donation.get());
            tx.commit();

            response.type("application/json");
            return gson.toJson(Map.of("message", "Donation deleted successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while deleting the donation\"}";
        } finally {
            entityManager.close();
        }
    };
}

package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Inscription;
import austral.ing.lab1.model.InscriptionStatus;
import austral.ing.lab1.model.Notification;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Inscriptions;
import austral.ing.lab1.repository.NotificationService;
import austral.ing.lab1.repository.Users;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.List;
import java.util.Map;
import austral.ing.lab1.model.Institution;
import austral.ing.lab1.repository.Institutions;

public class InscriptionController {

  private static final Gson gson = new Gson();
  private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

  public static Route handleInscription = (Request request, Response response) -> {

    String requestedUserEmail = request.headers("Email");
    Long opportunityId = Long.parseLong(request.headers("OpportunityId")); // Obtener el ID de la oportunidad del header

    String body = request.body();
    Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
    }.getType());

    // Verify required fields are not empty or blank
    if (formData.get("localidad").trim().isEmpty() || formData.get("mensaje").trim().isEmpty()) {
      response.status(400);
      return "{\"error\": \"Missing or empty fields\"}";
    }

    // Create and persist the opportunity in the database
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Inscriptions inscriptions = new Inscriptions(entityManager);
    Users users = new Users(entityManager);
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();

      Opportunity opportunity = entityManager.find(Opportunity.class, opportunityId);

      if (opportunity == null) {
        response.status(404);
        return "{\"error\": \"Opportunity not found for the provided ID\"}";
      }

      int capacity = opportunity.getCapacity();
      if (capacity <= 0) {
        response.status(400);
        return "{\"error\": \"No capacity available for this opportunity\"}";
      }

      User user = users.findByEmail(requestedUserEmail).orElse(null);
      if (user == null) {
        response.status(404);
        return "{\"error\": \"User not found for the provided email\"}";
      }

      String localidad = formData.get("localidad");
      String mensaje = formData.get("mensaje");

      Inscription inscription = new Inscription();
      inscription.setNombre(user.getFirstName());
      inscription.setApellido(user.getLastName());
      inscription.setLocalidad(localidad);
      inscription.setMensaje(mensaje);

      inscription.setEmailParticipante(requestedUserEmail);
      inscription.setOpportunityID(opportunityId);

      // Set status to "pending" by default
      inscription.setEstado(InscriptionStatus.PENDING);

      // Decrement the opportunity's capacity
      opportunity.setCapacity(capacity - 1);

      inscriptions.persist(inscription);

      tx.commit();
      
      // 🔔 NUEVA FUNCIONALIDAD: Notificar a la institución
      try {
          // Buscar la institución por email para obtener su ID
          Institutions institutions = new Institutions(entityManager);
          Institution institution = institutions.findByEmail(opportunity.getInstitutionEmail()).orElse(null);
          
          if (institution != null) {
              System.out.println("🔔 Sending notification to institution: " + institution.getId());
              
              // Crear servicio de notificaciones
              NotificationService notificationService = new NotificationService(entityManager);
              
              // Crear mensaje personalizado
              String message = "Nuevo participante inscrito: " + user.getFirstName() + " " + user.getLastName() + 
                             " se inscribió en la oportunidad: " + opportunity.getName();
              
              // Crear y enviar notificación
              Notification notification = new Notification(message, null, institution.getId());
              notificationService.sendNotification(notification);
              System.out.println("✅ Notification sent to institution: " + institution.getId());
          }
      } catch (Exception notificationError) {
          // No fallar la inscripción si las notificaciones fallan
          System.err.println("⚠️ Error sending notification to institution: " + notificationError.getMessage());
          notificationError.printStackTrace();
      }
      
      response.type("application/json");
      return gson.toJson(Map.of("message", "Opportunity added successfully"));
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      response.status(500);
      return "{\"error\": \"An error occurred while adding the opportunity\"}";
    } finally {
      entityManager.close();
    }
  };

  public static Route handleAcceptInscription = (Request request, Response response) -> {
    String requestBody = request.body();
    Map<String, String> bodyMap = gson.fromJson(requestBody, new TypeToken<Map<String, String>>(){}.getType());
    String idInscription1 = bodyMap.get("inscriptionId");

    Long idInscriptionLong = Long.parseLong(idInscription1);

    // Actualizar el estado de la inscripción a "aceptada"
    updateInscriptionStatus(idInscriptionLong, InscriptionStatus.ACCEPTED, response);

    // Enviar notificación
    EntityManager em = entityManagerFactory.createEntityManager();
    NotificationService notificationService = new NotificationService(em);
    String message = "Your inscription has been accepted.";

    // Buscar la inscripción para obtener el email
    Inscriptions inscriptions = new Inscriptions(em);
    Inscription inscription = inscriptions.findById(idInscriptionLong);
    if (inscription == null) {
      em.close();
      return gson.toJson(Map.of("error", "Inscription not found"));
    }

    // Buscar el usuario para obtener el userId
    Users users = new Users(em);
    User user = users.findByEmail(inscription.getEmailParticipante()).orElse(null);
    if (user == null) {
      em.close();
      return gson.toJson(Map.of("error", "User not found"));
    }

    Notification notification = new Notification(message, user.getId(), null); // Asume que Notification tiene una relación adecuada con User para obtener el userId
    notificationService.sendNotification(notification);
    em.close();

    return gson.toJson(Map.of("message", "Inscription accepted"));
  };

  public static Route handleRejectInscription = (Request request, Response response) -> {
    String requestBody = request.body();
    Map<String, String> bodyMap = gson.fromJson(requestBody, new TypeToken<Map<String, String>>(){}.getType());
    String idInscription1 = bodyMap.get("inscriptionId");

    Long idInscriptionLong = Long.parseLong(idInscription1);

    // Actualizar el estado de la inscripción a "rechazada"
    updateInscriptionStatus(idInscriptionLong, InscriptionStatus.REJECTED, response);

    // Enviar notificación
    EntityManager em = entityManagerFactory.createEntityManager();
    NotificationService notificationService = new NotificationService(em);
    String message = "Your inscription has been rejected.";

    // Buscar la inscripción para obtener el email
    Inscriptions inscriptions = new Inscriptions(em);
    Inscription inscription = inscriptions.findById(idInscriptionLong);
    if (inscription == null) {
      em.close();
      return gson.toJson(Map.of("error", "Inscription not found"));
    }

    // Buscar el usuario para obtener el userId
    Users users = new Users(em);
    User user = users.findByEmail(inscription.getEmailParticipante()).orElse(null);
    if (user == null) {
      em.close();
      return gson.toJson(Map.of("error", "User not found"));
    }

    Notification notification = new Notification(message, user.getId(), null); // Asume que Notification tiene una relación adecuada con User para obtener el userId
    notificationService.sendNotification(notification);
    em.close();

    return gson.toJson(Map.of("message", "Inscription rejected"));
  };

  private static void updateInscriptionStatus(Long idInscription, InscriptionStatus newStatus, Response response) {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Inscriptions inscriptions = new Inscriptions(entityManager);
    EntityTransaction tx = entityManager.getTransaction();

    try {
      tx.begin();

      Inscription inscription = inscriptions.findById(idInscription);
      if (inscription == null) {
        response.status(404);
        response.body("{\"error\": \"Inscription not found for the provided email\"}");
        return;
      }

      inscription.setEstado(newStatus); // Update the status of the inscription

      inscriptions.persist(inscription);

      tx.commit();
      response.status(200);
      response.body("{\"message\": \"Inscription status updated successfully\"}");
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      response.status(500);
      response.body("{\"error\": \"An error occurred while updating the inscription status\"}");
    } finally {
      entityManager.close();
    }
  }

  public static Route handleShowInscriptions = (Request request, Response response) -> {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Inscriptions inscriptions = new Inscriptions(entityManager);

    String requestedUserEmail = request.headers("Email");

    if (requestedUserEmail != null && !requestedUserEmail.isEmpty()) {
      // Fetch all opportunities associated with the email
      List<Opportunity> opportunities = entityManager.createQuery(
                      "SELECT o FROM Opportunity o WHERE o.institutionEmail = :institutionEmail", Opportunity.class)
              .setParameter("institutionEmail", requestedUserEmail)
              .getResultList();

      JsonArray allInscriptionsJson = new JsonArray();

      // For each opportunity, fetch the associated inscriptions
      for (Opportunity opportunity : opportunities) {
        JsonObject opportunityJson = new JsonObject();
        opportunityJson.addProperty("opportunityName", opportunity.getName());

        List<Inscription> inscriptionsForOpportunity = inscriptions.findByOpportunityId(opportunity.getId());
        JsonArray inscriptionsJson = new JsonArray();

        // Convert each inscription to a JSON object
        for (Inscription inscription : inscriptionsForOpportunity) {
          JsonObject inscriptionJson = new JsonObject();
          inscriptionJson.addProperty("inscriptionId", inscription.getId());
          inscriptionJson.addProperty("inscriptionName", inscription.getNombre());
          inscriptionJson.addProperty("emailParticipante", inscription.getEmailParticipante());
          inscriptionJson.addProperty("localidad", inscription.getLocalidad());
          inscriptionJson.addProperty("estado", inscription.getEstado().toString());

          inscriptionsJson.add(inscriptionJson);
        }

        opportunityJson.add("inscriptions", inscriptionsJson);
        allInscriptionsJson.add(opportunityJson);
      }

      // Set the response type and return the JSON
      response.type("application/json");
      return allInscriptionsJson.toString();
    } else {
      response.status(400); // Bad Request if the email is empty
      return "Correo electrónico de la institución no proporcionado.";
    }
  };
}
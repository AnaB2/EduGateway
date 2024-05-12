package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Inscription;
import austral.ing.lab1.model.InscriptionStatus;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.repository.Inscriptions;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import spark.Request;
import spark.Response;
import spark.Route;

public class InscriptionController {

  private static final Gson gson = new Gson();
  private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

  public static Route handleInscription = (Request request, Response response) -> {


    String requestedUserEmail = request.headers("Email");
    Long opportunityId = Long.parseLong(request.headers("OpportunityId")); // Obtener el ID de la oportunidad del header

    String body = request.body();
    Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
    }.getType());

    // Verificar que los campos requeridos no estén vacíos o en blanco
    if (formData.get("name").trim().isEmpty() || formData.get("apellido").trim().isEmpty() ||
        formData.get("localidad").trim().isEmpty()) {
      response.status(400);
      return "{\"error\": \"Missing or empty fields\"}";
    }

    // Crear y persistir la oportunidad en la base de datos
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Inscriptions inscriptions = new Inscriptions(entityManager);
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

      String name = formData.get("name");
      String apellido = formData.get("apellido");
      String localidad = formData.get("localidad");

      Inscription inscription = new Inscription();
      inscription.setNombre(name);
      inscription.setApellido(apellido);
      inscription.setLocalidad(localidad);

      inscription.setEmailParticipante(requestedUserEmail);
      inscription.setOpportunityID(opportunityId);

      // Establecer el estado como "pendiente" por defecto
      inscription.setEstado(InscriptionStatus.PENDING);

      // Decrementar la capacidad de la oportunidad
      opportunity.setCapacity(capacity - 1);


      inscriptions.persist(inscription);

      tx.commit();
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

    return null;
  };

  public static Route handleRejectInscription = (Request request, Response response) -> {
    String requestBody = request.body();
    Map<String, String> bodyMap = gson.fromJson(requestBody, new TypeToken<Map<String, String>>(){}.getType());
    String idInscription1 = bodyMap.get("inscriptionId");

    Long idInscriptionLong = Long.parseLong(idInscription1);
    // Actualizar el estado de la inscripción a "rechazada"
    updateInscriptionStatus(idInscriptionLong, InscriptionStatus.REJECTED, response);

    return null;
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
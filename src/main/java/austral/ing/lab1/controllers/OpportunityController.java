package austral.ing.lab1.controllers;


import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.repository.Opportunities;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import spark.Request;
import spark.Response;
import spark.Route;

public class OpportunityController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleAddOpportunity = (Request request, Response response) -> {
        // Obtener el token del encabezado de la solicitud
//        String token = request.headers("Authorization");


        // Imprimir el token recibido en la consola
//        System.out.println("Token recibido: " + token);



        // Obtener los datos del usuario que realiza la solicitud
        String requestedUserEmail = request.headers("Email");

        // Verificar si el usuario está autorizado
//        if (!TokenManager.isAuthorized(token, requestedUserEmail)) {
//            response.status(401);
//          return "{\"error\": \"Unauthorized\"}";
//        }



        // Obtener los datos de la oportunidad del cuerpo de la solicitud
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        // Verificar que los campos requeridos no estén vacíos o en blanco
        if (formData.get("name").trim().isEmpty() || formData.get("category").trim().isEmpty() ||
                formData.get("city").trim().isEmpty() || formData.get("educationalLevel").trim().isEmpty() ||
                formData.get("deliveryMode").trim().isEmpty() || formData.get("language").trim().isEmpty() ||
                formData.get("capacity").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        // Crear y persistir la oportunidad en la base de datos
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();

            String name = formData.get("name");
            String category = formData.get("category");
            String city = formData.get("city");
            String educationalLevel = formData.get("educationalLevel");
            String deliveryMode = formData.get("deliveryMode");
            String language = formData.get("language");
            int capacity = Integer.parseInt(formData.get("capacity"));

            Opportunity opportunity = new Opportunity();
            opportunity.setName(name);
            opportunity.setCategory(category);
            opportunity.setCity(city);
            opportunity.setEducationalLevel(educationalLevel);
            opportunity.setDeliveryMode(deliveryMode);
            opportunity.setLanguage(language);
            opportunity.setCapacity(capacity);


            opportunity.setInstitutionEmail(requestedUserEmail);

            opportunities.persist(opportunity);






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

    public static Route handleDeleteOpportunity = (Request request, Response response) -> {
        // Obtener los datos de la oportunidad a eliminar del cuerpo de la solicitud
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        // Verificar que el campo de nombre no esté vacío o en blanco
        if (formData.get("name").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty name field\"}";
        }

        // Obtener el nombre de la oportunidad a eliminar
        String opportunityName = formData.get("name");

        // Eliminar la oportunidad de la base de datos
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();

            // Buscar la oportunidad por su nombre
            Opportunity opportunity = opportunities.findByName(opportunityName);

            if (opportunity == null) {
                response.status(404);
                return "{\"error\": \"Opportunity not found\"}";
            }

            opportunities.delete(opportunity);
            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity deleted successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while deleting the opportunity\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleModifyOpportunity = (Request request, Response response) -> {
        // Obtener los datos de la oportunidad a modificar del cuerpo de la solicitud
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        // Verificar que el campo de nombre no esté vacío o en blanco
        if (formData.get("name").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty name field\"}";
        }

        // Obtener el nombre de la oportunidad a modificar
        String opportunityName = formData.get("name");

        // Verificar que los campos requeridos no estén vacíos o en blanco
        if (formData.get("category").trim().isEmpty() || formData.get("city").trim().isEmpty() ||
                formData.get("educationalLevel").trim().isEmpty() || formData.get("deliveryMode").trim().isEmpty() ||
                formData.get("language").trim().isEmpty() || formData.get("capacity").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        // Obtener los nuevos valores de la oportunidad a modificar
        String category = formData.get("category");
        String city = formData.get("city");
        String educationalLevel = formData.get("educationalLevel");
        String deliveryMode = formData.get("deliveryMode");
        String language = formData.get("language");
        int capacity = Integer.parseInt(formData.get("capacity"));

        // Modificar la oportunidad en la base de datos
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();

            // Buscar la oportunidad por su nombre
            Opportunity opportunity = opportunities.findByName(opportunityName);

            if (opportunity == null) {
                response.status(404);
                return "{\"error\": \"Opportunity not found\"}";
            }

            // Actualizar los valores de la oportunidad
            opportunity.setCategory(category);
            opportunity.setCity(city);
            opportunity.setEducationalLevel(educationalLevel);
            opportunity.setDeliveryMode(deliveryMode);
            opportunity.setLanguage(language);
            opportunity.setCapacity(capacity);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity modified successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while modifying the opportunity\"}";
        } finally {
            entityManager.close();
        }
    };
}
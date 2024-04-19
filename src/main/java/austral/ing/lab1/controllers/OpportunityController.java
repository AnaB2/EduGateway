package austral.ing.lab1.controllers;

import austral.ing.lab1.TokenManager;
import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.repository.Institutions;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.Map;

public class OpportunityController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleAddOpportunity = (Request request, Response response) -> {
        // Obtener los datos de la oportunidad del cuerpo de la solicitud
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        // Verificar que los campos requeridos no estén vacíos o en blanco
        if (formData.get("name").trim().isEmpty() || formData.get("category").trim().isEmpty() ||
                formData.get("region").trim().isEmpty() || formData.get("city").trim().isEmpty() ||
                formData.get("educationalLevel").trim().isEmpty() || formData.get("language").trim().isEmpty() ||
                formData.get("vacancies").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        // Obtener el correo electrónico de la institución desde el token de autorización
        String token = request.headers("Authorization");
        String email = TokenManager.getUserEmail(token);

        // Crear y persistir la oportunidad en la base de datos
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();

            // Buscar la institución por correo electrónico
            Institution institution = institutions.findByEmail(email).orElse(null);
            if (institution == null) {
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            // Crear la oportunidad
            Opportunity opportunity = new Opportunity(
                    institution,
                    formData.get("name"),
                    formData.get("category"),
                    formData.get("region"),
                    formData.get("city"),
                    formData.get("educationalLevel"),
                    formData.get("language"),
                    Integer.parseInt(formData.get("vacancies"))
            );

            // Persistir la oportunidad
            entityManager.persist(opportunity);
            tx.commit();

            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity added successfully"));
        } catch (NumberFormatException e) {
            response.status(400);
            return "{\"error\": \"Invalid value for vacancies, must be an integer\"}";
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
}


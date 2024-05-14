package austral.ing.lab1.controllers;


import austral.ing.lab1.model.Institution;
import austral.ing.lab1.repository.Institutions;
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

public class InstitutionController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleEditInstitution = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
        }.getType());

        String institutionalEmail = formData.get("previousEmail");

        if (formData.get("institutionalName").trim().isEmpty() ||
                formData.get("password").trim().isEmpty() ||
                formData.get("description").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            Institution institution = institutions.findByEmail(institutionalEmail).orElse(null);

            if (institution == null) {
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            institution.setEmail(formData.get("institutionalName"));
            institution.setPassword(formData.get("password"));
            institution.setDescription(formData.get("description"));

            institutions.persist(institution);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Institutional profile updated successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while updating the institutional profile\"}";
        } finally {
            entityManager.close();
        }
    };
}
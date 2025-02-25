package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Opportunities;
import com.google.gson.Gson;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import spark.Request;
import spark.Response;
import spark.Route;

public class FilterController {
  private static final Gson gson = new Gson();
  private static final EntityManagerFactory entityManagerFactory =
          Persistence.createEntityManagerFactory("test");

    public static Route FilterByCategory = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String category = request.queryParams("category");
            if (category == null || category.trim().isEmpty()) {
                response.status(400);
                return "{\"error\": \"Missing category\"}";
            }

            // Get pagination parameters
            int page = Integer.parseInt(request.queryParams("page") != null ? request.queryParams("page") : "1");
            int size = Integer.parseInt(request.queryParams("size") != null ? request.queryParams("size") : "10");

            if (page < 1 || size < 1) {
                response.status(400);
                return "{\"error\": \"Invalid pagination parameters\"}";
            }

            // Fetch paginated results
            List<Opportunity> opportunities = entityManager.createQuery(
                            "SELECT o FROM Opportunity o WHERE o.category = :category", Opportunity.class)
                    .setParameter("category", category)
                    .setFirstResult((page - 1) * size)
                    .setMaxResults(size)
                    .getResultList();

            // Convert to JSON
            String jsonOpportunities = gson.toJson(opportunities);
            response.type("application/json");
            return jsonOpportunities;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching opportunities by category\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route FilterByNameOpportunity = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String name = request.queryParams("name");
            if (name == null || name.trim().isEmpty()) {
                response.status(400);
                return "{\"error\": \"Missing name\"}";
            }

            // Get pagination parameters
            int page = Integer.parseInt(request.queryParams("page") != null ? request.queryParams("page") : "1");
            int size = Integer.parseInt(request.queryParams("size") != null ? request.queryParams("size") : "10");

            if (page < 1 || size < 1) {
                response.status(400);
                return "{\"error\": \"Invalid pagination parameters\"}";
            }

            // Fetch paginated results
            List<Opportunity> opportunities = entityManager.createQuery(
                            "SELECT o FROM Opportunity o WHERE o.name LIKE :name", Opportunity.class)
                    .setParameter("name", "%" + name + "%")
                    .setFirstResult((page - 1) * size)
                    .setMaxResults(size)
                    .getResultList();

            // Convert to JSON
            String jsonOpportunities = gson.toJson(opportunities);
            response.type("application/json");
            return jsonOpportunities;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching opportunities by name\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route FilterByNameInstitution = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String institutionName = request.queryParams("InstitutionName");
            if (institutionName == null || institutionName.trim().isEmpty()) {
                response.status(400);
                return "{\"error\": \"Missing institution name\"}";
            }

            // Get pagination parameters
            int page = Integer.parseInt(request.queryParams("page") != null ? request.queryParams("page") : "1");
            int size = Integer.parseInt(request.queryParams("size") != null ? request.queryParams("size") : "10");

            if (page < 1 || size < 1) {
                response.status(400);
                return "{\"error\": \"Invalid pagination parameters\"}";
            }

            // Find institution emails matching the name
            List<String> emailInstitutions = entityManager.createQuery(
                            "SELECT i.email FROM Institution i WHERE i.institutionalName LIKE :name", String.class)
                    .setParameter("name", "%" + institutionName + "%")
                    .getResultList();

            if (emailInstitutions.isEmpty()) {
                response.status(404);
                return "{\"error\": \"No institutions found\"}";
            }

            // Fetch paginated opportunities
            List<Opportunity> opportunities = entityManager.createQuery(
                            "SELECT o FROM Opportunity o WHERE o.institutionEmail IN :emails", Opportunity.class)
                    .setParameter("emails", emailInstitutions)
                    .setFirstResult((page - 1) * size)
                    .setMaxResults(size)
                    .getResultList();

            // Convert to JSON
            String jsonOpportunities = gson.toJson(opportunities);
            response.type("application/json");
            return jsonOpportunities;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching opportunities by institution name\"}";
        } finally {
            entityManager.close();
        }
    };

}
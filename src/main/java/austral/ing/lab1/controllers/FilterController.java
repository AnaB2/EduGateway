package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Institution;
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

      List<Opportunity> opportunities = new Opportunities(entityManager).findByCategory(category);

      // Convertir la lista de oportunidades a JSON
      String jsonOpportunities = gson.toJson(opportunities);

      // Configurar la respuesta
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
        return "{\"error\": \"Missing category\"}";
      }

      List<Opportunity> opportunities = new Opportunities(entityManager).findByNameOpportunity(name);

      // Convertir la lista de oportunidades a JSON
      String jsonOpportunities = gson.toJson(opportunities);

      // Configurar la respuesta
      response.type("application/json");
      return jsonOpportunities;
    } catch (Exception e) {
      response.status(500);
      return "{\"error\": \"An error occurred while fetching opportunities by category\"}";
    } finally {
      entityManager.close();
    }

  };

  // Hacer que de lo que se escriba es decir el nombre de la institucion, darme todos los mails asociados a esos posibles nombres y luego buscar las oportunidades.
  public static Route FilterByNameInstituon = (Request request, Response response) -> {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    try {
      String InstitutionName = request.queryParams("InstitutionName");
      if (InstitutionName == null || InstitutionName.trim().isEmpty()) {
        response.status(400);
        return "{\"error\": \"Missing category\"}";
      }

      String emailInstitution = new Institutions(entityManager).findEmailByInstitutionName(InstitutionName);

      List<Opportunity> opportunities = new Opportunities(entityManager).findByUserEmail(emailInstitution);

      // Convertir la lista de oportunidades a JSON
      String jsonOpportunities = gson.toJson(opportunities);

      // Configurar la respuesta
      response.type("application/json");
      return jsonOpportunities;
    } catch (Exception e) {
      response.status(500);
      return "{\"error\": \"An error occurred while fetching opportunities by category\"}";
    } finally {
      entityManager.close();
    }

  };




















}


















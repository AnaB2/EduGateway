package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Users;
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

public class SignupController {

  private static final Gson gson = new Gson();
  private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

  public static Route handleSignupParticipant = (Request request, Response response) -> {
    String body = request.body();
    Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

    if (formData.get("email").trim().isEmpty() || formData.get("password").trim().isEmpty() ||
            formData.get("firstname").trim().isEmpty() || formData.get("lastname").trim().isEmpty()) {
      response.status(400);
      return "{\"error\": \"Missing or empty fields\"}";
    }

    String email = formData.get("email");
    if (!isValidEmail(email)) {
      response.status(400);
      return "{\"error\": \"Invalid email format\"}";
    }

    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Users users = new Users(entityManager);
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();

      if(users.findByEmail(email).isPresent()){
        response.status(409);
        return "{\"error\": \"User already exists\"}";
      }

      String password = formData.get("password");
      String firstname = formData.get("firstname");
      String lastname = formData.get("lastname");

      User user = User.create(email)
              .password(password).firstName(firstname).lastName(lastname)
              .build();
      User persistedUser = users.persist(user);
      tx.commit();
      response.type("application/json");
      return gson.toJson(Map.of("message", "User signed up successfully"));
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      response.status(500);
      return "{\"error\": \"An error occurred while registering the user\"}";
    } finally {
      entityManager.close();
    }
  };

  public static Route handleSignupInstitution = (Request request, Response response) -> {
    String body = request.body();
    Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

    if (formData.get("email").trim().isEmpty() || formData.get("password").trim().isEmpty() ||
            formData.get("institutionalName").trim().isEmpty() || formData.get("credential").trim().isEmpty()) {
      response.status(400);
      return "{\"error\": \"Missing or empty fields\"}";
    }

    String email = formData.get("email");
    if (!isValidEmail(email)) {
      response.status(400);
      return "{\"error\": \"Invalid email format\"}";
    }

    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Institutions institutions = new Institutions(entityManager);
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();

      if(institutions.findByEmail(email).isPresent()){
        response.status(409);
        return "{\"error\": \"Institution already exists\"}";
      }

      String password = formData.get("password");
      String institutionalName = formData.get("institutionalName");
      String credential = formData.get("credential");

      Institution institution = Institution.create(email)
              .password(password).institutionalName(institutionalName).credential(credential).build();
      Institution persistedInstitution = institutions.persist(institution);

      tx.commit();
      response.type("application/json");
      return gson.toJson(Map.of("message", "Institution signed up successfully"));
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      response.status(500);
      return "{\"error\": \"An error occurred while registering the Institution\"}";
    } finally {
      entityManager.close();
    }
  };

  private static boolean isValidEmail(String email) {
    // Implement email validation logic here
    // For example, you can use regular expressions or a library like Apache Commons Validator
    // Here's a basic example:
    return email.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  }
}

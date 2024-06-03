package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Users;
import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.Map;
import java.util.regex.Pattern;

public class SignupController {

  private static final Gson gson = new Gson();
  private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");
  private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

  public static Route handleSignupUser = (Request request, Response response) -> {
    String body = request.body();
    User newUser = gson.fromJson(body, User.class);

    if (!isValidEmail(newUser.getEmail())) {
      response.status(400);
      return "{\"error\": \"Invalid email format\"}";
    }

    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Users users = new Users(entityManager);
    Institutions institutions = new Institutions(entityManager);
    EntityTransaction tx = entityManager.getTransaction();

    try {
      tx.begin();

      if (emailExists(newUser.getEmail(), users, institutions)) {
        response.status(400);
        return "{\"error\": \"Email already in use\"}";
      }

      users.persist(newUser);
      tx.commit();

      response.type("application/json");
      return gson.toJson(Map.of("message", "User registered successfully"));
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      e.printStackTrace();
      response.status(500);
      return "{\"error\": \"An error occurred while registering the user\"}";
    } finally {
      entityManager.close();
    }
  };

  public static Route handleSignupInstitution = (Request request, Response response) -> {
    String body = request.body();
    Institution newInstitution = gson.fromJson(body, Institution.class);

    if (!isValidEmail(newInstitution.getEmail())) {
      response.status(400);
      return "{\"error\": \"Invalid email format\"}";
    }

    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Institutions institutions = new Institutions(entityManager);
    Users users = new Users(entityManager);
    EntityTransaction tx = entityManager.getTransaction();

    try {
      tx.begin();

      if (emailExists(newInstitution.getEmail(), users, institutions)) {
        response.status(400);
        return "{\"error\": \"Email already in use\"}";
      }

      institutions.persist(newInstitution);
      tx.commit();

      response.type("application/json");
      return gson.toJson(Map.of("message", "Institution registered successfully"));
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      e.printStackTrace();
      response.status(500);
      return "{\"error\": \"An error occurred while registering the institution\"}";
    } finally {
      entityManager.close();
    }
  };

  private static boolean emailExists(String email, Users users, Institutions institutions) {
    return users.findByEmail(email).isPresent() || institutions.findByEmail(email).isPresent();
  }

  private static boolean isValidEmail(String email) {
    return EMAIL_PATTERN.matcher(email).find();
  }
}

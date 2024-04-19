package austral.ing.lab1.authentication;

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

public class RegisterController {

  private static final Gson gson = new Gson();
  private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

  public static Route handleRegisterParticipant = (Request request, Response response) -> {
    // Obtener los datos del Registro del cuerpo de la solicitud
    String body = request.body();
    Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

    // Verificar que los campos requeridos no estén vacíos o en blanco
    if (formData.get("email").trim().isEmpty() || formData.get("password").trim().isEmpty() ||
        formData.get("firstname").trim().isEmpty() || formData.get("lastname").trim().isEmpty()) {
      response.status(400);
      return "{\"error\": \"Missing or empty fields\"}";
    }

    // Verificar que el correo electrónico tenga el formato adecuado
    String email = formData.get("email");
    if (!email.endsWith("@gmail.com")) {
      response.status(400);
      return "{\"error\": \"Email must be a valid Gmail address\"}";
    }

    String password = formData.get("password");
    String firstname = formData.get("firstname");
    String lastname = formData.get("lastname");




    // Crear y persistir el usuario en la base de datos
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Users users = new Users(entityManager);
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();
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




  public static Route handleRegisterInstitution = (Request request, Response response) -> {
//     Obtener los datos del Registro del cuerpo de la solicitud
    String body = request.body();
    Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
    }.getType());

//     Verificar que los campos requeridos no estén vacíos o en blanco
    if (formData.get("email").trim().isEmpty() || formData.get("password").trim().isEmpty() ||
        formData.get("institutionalName").trim().isEmpty() || formData.get("credential").trim().isEmpty()){
      response.status(400);
      return "{\"error\": \"Missing or empty fields\"}";
    }

//     Verificar que el correo electrónico tenga el formato adecuado
    String email = formData.get("email");
    if (!email.endsWith("@gmail.com")) {
      response.status(400);
      return "{\"error\": \"Email must be a valid Gmail address\"}";
    }

    String password = formData.get("password");
    String institutionalName = formData.get("institutionalName");
    String credential = formData.get("credential");






//     Crear y persistir la Institucion en la base de datos
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    Institutions institutions = new Institutions(entityManager);
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();

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
//
//
  };

}
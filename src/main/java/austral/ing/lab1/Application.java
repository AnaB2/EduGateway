package austral.ing.lab1;

import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Users;
import com.google.common.base.Strings;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import spark.Spark;

public class Application {

  private static final Gson gson = new Gson();
  public static void main(String[] args) {

    final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    Spark.port(4321);

    storedBasicUser(entityManagerFactory);


    Spark.post("/registro", (request, response) -> {
      // Obtener los datos del cuerpo de la solicitud
      String body = request.body();

      // Analizar los datos del formulario, por ejemplo, si están en formato JSON
      Gson gson = new Gson();
      Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>(){}.getType());

      String email = formData.get("email");
      String password = formData.get("password");

      // Crear un nuevo usuario
      User user = User.create(email)
          .password(password)
          .build();

      // Guardar el usuario en la base de datos
      EntityManager entityManager = entityManagerFactory.createEntityManager();
      Users users = new Users(entityManager);
      EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
      User persistedUser = users.persist(user);
      tx.commit();
      // Realizar cualquier otra acción necesaria, como redireccionar o enviar una respuesta


      // Cerrar el EntityManager y la EntityManagerFactory cuando no sean necesarios
      entityManager.close();
      entityManagerFactory.close();

      response.status(200);
      return "ok";
    });








    /* 1. Basic Request */
    Spark.get("/",
        (req, resp) -> "hello world"
    );

    /* 2. Dynamic Content: Get Current Date & Time */
    Spark.get("/web/v1",
        (req, resp) -> {
          final String now = Instant.now().toString();
          return "<!DOCTYPE html>\n" +
              "<html lang=\"en\">\n" +
              "<head>\n" +
              "  <meta charset=\"UTF-8\">\n" +
              "  <title>Server side rendering v1</title>\n" +
              "</head>\n" +
              "<body>\n" +
              "\n" +
              "  <h1>Hora actual</h1>\n" +
              "  <h3>" + now + "</h3>  \n" +
              "\n" +
              "</body>\n" +
              "</html>";
        }
    );

    /* 3. Dynamic Content: Show User Details - Url params */
    Spark.get("/users/:name",
        (req, resp) -> {
          final String name = capitalized(req.params("name"));

          final User user = User.create(name + "@gmail.com").firstName(name).lastName("Skywalker").build();

          resp.type("application/json");

          return user.asJson();
        }
    );

    /* 4. Dynamic Content: Show User Details - Query params */
    Spark.get("/users",
        (req, resp) -> {
          final String name = capitalized(req.queryParams("name"));

          final User user = User.create(name + "@gmail.com").firstName(name).lastName("Skywalker").build();

          resp.type("application/json");

          return user.asJson();
        }
    );

    /* 5. Dynamic Content from Db */
    Spark.get("/persisted-users/:id",
        (req, resp) -> {
          final String id = req.params("id");

          /* Business Logic */
          final EntityManager entityManager = entityManagerFactory.createEntityManager();
          final EntityTransaction tx = entityManager.getTransaction();
          tx.begin();
          User user = entityManager.find(User.class, Long.valueOf(id));
          tx.commit();
          entityManager.close();

          resp.type("application/json");
          return user.asJson();
        }
    );

    /* 6. Receiving data from client */
    Spark.post("/users", "application/json", (req, resp) -> {
      final User user = User.fromJson(req.body());

      /* Begin Business Logic */
      final EntityManager entityManager = entityManagerFactory.createEntityManager();
      final Users users = new Users(entityManager);
      EntityTransaction tx = entityManager.getTransaction();
      tx.begin();
      users.persist(user);
      resp.type("application/json");
      resp.status(201);
      tx.commit();
      entityManager.close();
      /* End Business Logic */

      return user.asJson();
    });

    Spark.get("/users1", "application/json", (req, resp) -> {

      resp.type("application/json");
      resp.status(201);

      User u1 = User.create("ja1").lastName("pee").build();
      User u2 = User.create("ja2").lastName("pee").build();

      List<User> users = Arrays.asList(u1, u2);
      return gson.toJson(users);
    });

    Spark.options("/*", (req, res) -> {
      String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        res.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    Spark.before((req, res) -> {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.type("application/json");
    });
  }

  private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
    final EntityManager entityManager = entityManagerFactory.createEntityManager();
    final Users users = new Users(entityManager);

    EntityTransaction tx = entityManager.getTransaction();
    tx.begin();
    if (users.listAll().isEmpty()) {
      final User luke =
          User.create("luke.skywalker@jedis.org")
              .firstName("Luke")
              .lastName("Skywalker").
              build();
      final User leia =
          User.create("leia.skywalker@jedis.org")
              .firstName("Leia")
              .lastName("Skywalker")
              .build();

      users.persist(luke);
      users.persist(leia);
    }
    tx.commit();
    entityManager.close();
  }

  private static String capitalized(String name) {
    return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
  }
}


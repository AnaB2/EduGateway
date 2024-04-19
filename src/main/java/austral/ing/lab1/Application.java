package austral.ing.lab1;

import austral.ing.lab1.authentication.LoginController;
import austral.ing.lab1.authentication.LogoutController;
import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Opportunities;
import austral.ing.lab1.repository.Users;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import java.util.Map;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import spark.Spark;


public class Application {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static void main(String[] args) {
        Spark.port(4321);

        Spark.options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        Spark.before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "http://localhost:8081");
            response.header("Access-Control-Allow-Credentials", "true");
        });

        Spark.post("/sign-up-user", (request, response) -> {
            String body = request.body();
            Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
            }.getType());

            String email = formData.get("email");
            String password = formData.get("password");
            String firstname = formData.get("firstname");
            String lastname = formData.get("lastname");

            User user = User.create(email)
                    .password(password).firstName(firstname).lastName(lastname)
                    .build();

            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            try {
                tx.begin();
                User persistedUser = users.persist(user);
                tx.commit();
                response.type("application/json");
                return gson.toJson(Map.of("message", "User signed up successfully"));
            } catch (Exception e) {
                if (tx.isActive()) {
                    tx.rollback();
                }
                throw e;
            } finally {
                entityManager.close();
            }
        });



        Spark.post("/log-in-user", LoginController.handleLogin);
//        Spark.post("/edit-user", LoginController.handleLogin);

        Spark.post("/log-out-user", LogoutController.handleLogout);


//        Spark.post("/log-in-user", (request, response) -> {
//            String body = request.body();
//            Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
//            }.getType());
//
//            String email = formData.get("email");
//            String password = formData.get("password");
//
//            EntityManager entityManager = entityManagerFactory.createEntityManager();
//            Users users = new Users(entityManager);
//            Optional<User> userOptional = users.findByEmail(email);
//
//            try {
//                if (userOptional.isPresent()) {
//                    User user = userOptional.get();
//                    if (user.getPassword().equals(password)) {
//                        entityManager.close();
//                        response.type("application/json");
//                        return gson.toJson(Map.of("message", "User logged in successfully"));
//                    }
//                }
//                response.status(401);
//                return gson.toJson(Map.of("error", "Invalid email or password"));
//            } finally {
//                entityManager.close();
//            }
//        });1

        Spark.post("/sign-up-institution", (request, response) -> {
            String body = request.body();

            Gson gson = new Gson();
            Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>(){}.getType());

            String email = formData.get("email");
            String password = formData.get("password");
            String institutionalName = formData.get("institutionalName");
            String credential = formData.get("credential");

            Institution institution = new Institution();
            institution.setEmail(email);
            institution.setPassword(password);
            institution.setInstitutionalName(institutionalName);
            institution.setCredential(credential);

            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Institutions institutionRepository = new Institutions(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Institution persistedInstitution = institutionRepository.persist(institution);
            tx.commit();

            entityManager.close();

            response.type("application/json");
            return gson.toJson(Map.of("message", "User signed up successfully"));
        });

        Spark.post("/log-in-institution", (request, response) -> {
            String body = request.body();
            Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
            }.getType());

            String email = formData.get("email");
            String password = formData.get("password");

            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Institutions institutions = new Institutions(entityManager);
            Optional<Institution> institutionOptional = institutions.findByEmail(email);

            try {
                if (institutionOptional.isPresent()) {
                    Institution institution = institutionOptional.get();
                    if (institution.getPassword().equals(password)) {
                        entityManager.close();
                        response.type("application/json");
                        return gson.toJson(Map.of("message", "Institution logged in successfully"));
                    }
                }
                response.status(401);
                return gson.toJson(Map.of("error", "Invalid email or password"));
            } finally {
                entityManager.close();
            }
        });

        Spark.post("/add-opportunity", (request, response) -> {
            String body = request.body();
            Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
            }.getType());

            String email = formData.get("email");
            String password = formData.get("password");

            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Institutions institutions = new Institutions(entityManager);
            Optional<Institution> institutionOptional = institutions.findByEmail(email);

            try {
                if (institutionOptional.isPresent()) {
                    Institution institution = institutionOptional.get();
                    if (institution.getPassword().equals(password)) {
                        String name = formData.get("name");
                        String category = formData.get("category");
                        String region = formData.get("region");
                        String city = formData.get("city");
                        String educationalLevel = formData.get("educationalLevel");
                        String language = formData.get("language");
                        int vacancies = Integer.parseInt(formData.get("vacancies"));

                        Opportunity opportunity = new Opportunity(institution, name, category, region, city,
                                educationalLevel, language, vacancies);

                        Opportunities opportunities = new Opportunities(entityManager);
                        opportunities.persist(opportunity);

                        entityManager.getTransaction().commit();
                        entityManager.close();

                        response.type("application/json");
                        return gson.toJson(Map.of("message", "Opportunity added successfully"));
                    }
                }
                response.status(401);
                return gson.toJson(Map.of("error", "Invalid email or password"));
            } catch (NumberFormatException e) {
                response.status(400);
                return gson.toJson(Map.of("error", "Invalid number format for vacancies"));
            } finally {
                if (entityManager.isOpen()) {
                    entityManager.close();
                }
            }
        });

    }
}


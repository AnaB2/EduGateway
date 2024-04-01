package austral.ing.lab1.repository;

import austral.ing.lab1.model.User;
import austral.ing.lab1.persistence.Database;
import org.junit.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.List;

public class UsersTest {

  private EntityManagerFactory sessionFactory;

  private final static Database database = new Database();

  @BeforeClass
  public static void beforeSuite() {
    database.startDBServer();
  }

  @AfterClass
  public static void afterSuite() {
    database.stopDBServer();
  }

  @Before
  public void beforeTest() {
    sessionFactory = Persistence.createEntityManagerFactory("lab1");
  }

  @After
  public void close() {
    sessionFactory.close();
  }

  @Test
  public void persistAUser() {
    final EntityManager entityManager = sessionFactory.createEntityManager();
    final EntityTransaction transaction = entityManager.getTransaction();
    transaction.begin();

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

    entityManager.persist(luke);
    entityManager.persist(leia);

    final List<User> allUsers = entityManager
        .createQuery("SELECT u FROM User u", User.class)
        .getResultList();

    Assert.assertEquals(2 , allUsers.size());

    final List<User> users = entityManager
        .createQuery("SELECT u FROM User u WHERE u.email LIKE :email", User.class)
        .setParameter("email", "luke.skywalker@jedis.org").getResultList();

    Assert.assertEquals(1, users.size());
    Assert.assertEquals(users.get(0).getLastName(), "Skywalker");
    Assert.assertEquals(users.get(0).getFirstName(), "Luke");


    final User anotherLuke = entityManager.find(User.class, luke.getId());

    Assert.assertEquals(anotherLuke.getLastName(), "Skywalker");
    Assert.assertEquals(anotherLuke.getFirstName(), "Luke");

    entityManager.remove(leia);

    final List<User> allUsersAgain = entityManager
        .createQuery("SELECT u FROM User u", User.class)
        .getResultList();

    Assert.assertEquals(1, allUsersAgain.size());

    anotherLuke.setFirstName("LUKE");

    entityManager.persist(anotherLuke);

    User upperCaseLuke = entityManager.find(User.class, anotherLuke.getId());

    Assert.assertEquals("LUKE", upperCaseLuke.getFirstName());

    transaction.commit();

    entityManager.close();
  }
}
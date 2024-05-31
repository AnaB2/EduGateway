package austral.ing.lab1.repository;

import austral.ing.lab1.model.User;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Users {

  private final EntityManager entityManager;

  public Users(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public Optional<User> findById(Long id) {
    return Optional.ofNullable(entityManager.find(User.class, id));
  }

  public Optional<User> findByEmail(String email) {
    return entityManager
            .createQuery("SELECT u FROM User u WHERE u.email LIKE :email", User.class)
            .setParameter("email", email)
            .getResultList()
            .stream()
            .findFirst();
  }

  public List<User> listAll() {
    return entityManager.createQuery("SELECT u FROM User u", User.class).getResultList();
  }

  public User persist(User user) {
    entityManager.persist(user);
    return user;
  }

  public void delete(User user) {
    entityManager.remove(user);
  }
}
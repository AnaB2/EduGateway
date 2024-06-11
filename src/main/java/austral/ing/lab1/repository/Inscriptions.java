package austral.ing.lab1.repository;

import austral.ing.lab1.model.Inscription;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

public class Inscriptions {
  private final EntityManager entityManager;

  public Inscriptions(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public Inscription findById(Long id) {
    return entityManager.find(Inscription.class, id);
  }



  public Inscription findByEmailAndOpportunityId(String emailParticipante, Long opportunityId) {
    TypedQuery<Inscription> query = entityManager.createQuery(
        "SELECT i FROM Inscription i WHERE i.emailParticipante = :emailParticipante AND i.opportunity = :opportunityId", Inscription.class);
    query.setParameter("emailParticipante", emailParticipante);
    query.setParameter("opportunityId", opportunityId);

    List<Inscription> results = query.getResultList();
    return results.isEmpty() ? null : results.get(0);
  }


  public Inscription findByEmail(String email) {
    return entityManager
        .createQuery("SELECT i FROM Inscription i WHERE i.emailParticipante = :email", Inscription.class)
        .setParameter("email", email)
        .getSingleResult();
  }

  public void persist(Inscription inscripcion) {
    entityManager.persist(inscripcion);
  }

  public void delete(Inscription inscripcion) {
    entityManager.remove(inscripcion);
  }


  // Método para obtener las inscripciones por ID de oportunidad
  public List<Inscription> findByOpportunityId(Long opportunityId) {
    return entityManager
        .createQuery("SELECT i FROM Inscription i WHERE i.opportunity = :opportunityId", Inscription.class)
        .setParameter("opportunityId", opportunityId)
        .getResultList();
  }

  public List<Inscription> listAll() {
    TypedQuery<Inscription> query = entityManager.createQuery(
        "SELECT i FROM Inscription i", Inscription.class);
    return query.getResultList();
  }

  public List<Inscription> findByUserEmail(String userEmail) {
    TypedQuery<Inscription> query = entityManager.createQuery(
            "SELECT i FROM Inscription i WHERE i.emailParticipante = :userEmail", Inscription.class);
    query.setParameter("userEmail", userEmail);
    return query.getResultList();
  }

}
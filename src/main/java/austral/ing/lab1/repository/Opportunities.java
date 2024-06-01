package austral.ing.lab1.repository;

import austral.ing.lab1.model.Opportunity;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;

public class Opportunities {
    private final EntityManager entityManager;

    public Opportunities(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Opportunity findById(long id) {
        return entityManager.find(Opportunity.class, id);
    }

    public Opportunity findByName(String name) {
        TypedQuery<Opportunity> query = entityManager.createQuery(
            "SELECT o FROM Opportunity o WHERE o.name = :name", Opportunity.class);
        query.setParameter("name", name);

        List<Opportunity> results = query.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    public void persist(Opportunity opportunity) {
        entityManager.persist(opportunity);
    }

    public void delete(Opportunity opportunity) {
        entityManager.remove(opportunity);
    }

    public List<Opportunity> listAll() {
        TypedQuery<Opportunity> query = entityManager.createQuery(
            "SELECT o FROM Opportunity o", Opportunity.class);
        return query.getResultList();
    }


    public List<Opportunity> findByUserEmail(String userEmail) {
        TypedQuery<Opportunity> query = entityManager.createQuery(
            "SELECT o FROM Opportunity o WHERE o.institutionEmail = :userEmail", Opportunity.class);
        query.setParameter("userEmail", userEmail);

        return query.getResultList();
    }


    public List<Opportunity> findByCategory(String category) {
        TypedQuery<Opportunity> query = entityManager.createQuery(
            "SELECT o FROM Opportunity o WHERE o.category = :category", Opportunity.class);
        query.setParameter("category", category);

        return query.getResultList();
    }


    public List<Opportunity> findByNameOpportunity(String name) {
        TypedQuery<Opportunity> query = entityManager.createQuery(
            "SELECT o FROM Opportunity o WHERE o.name LIKE :name", Opportunity.class);
        query.setParameter("name", "%" + name + "%");

        return query.getResultList();
    }

}
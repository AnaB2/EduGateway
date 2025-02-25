package austral.ing.lab1.repository;

import austral.ing.lab1.model.Opportunity;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Set;

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


    public List<Opportunity> findByInstitutionalEmail(String institutionalEmail) {
        TypedQuery<Opportunity> query = entityManager.createQuery(
            "SELECT o FROM Opportunity o WHERE o.institutionEmail = :institutionalEmail", Opportunity.class);
        query.setParameter("institutionalEmail", institutionalEmail);

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

    public List<Opportunity> findByTags(Set<String> tags) {
        TypedQuery<Opportunity> query = entityManager.createQuery(
                "SELECT o FROM Opportunity o WHERE EXISTS (" +
                        "SELECT tag FROM o.tags tag WHERE tag IN :tags)", Opportunity.class);
        query.setParameter("tags", tags);
        return query.getResultList();
    }


}
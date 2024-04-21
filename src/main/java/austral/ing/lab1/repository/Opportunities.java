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
}
package austral.ing.lab1.repository;

import austral.ing.lab1.model.Opportunity;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Opportunities {

    private final EntityManager entityManager;

    public Opportunities(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Opportunity> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Opportunity.class, id));
    }

    public List<Opportunity> findByInstitutionId(Long institutionId) {
        return entityManager
                .createQuery("SELECT o FROM Opportunity o WHERE o.institution.id = :institutionId", Opportunity.class)
                .setParameter("institutionId", institutionId)
                .getResultList();
    }

    public List<Opportunity> listAll() {
        return entityManager.createQuery("SELECT o FROM Opportunity o", Opportunity.class).getResultList();
    }

    public void persist(Opportunity opportunity) {
        entityManager.persist(opportunity);
    }
}


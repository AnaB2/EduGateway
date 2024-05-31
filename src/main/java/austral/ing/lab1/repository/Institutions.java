package austral.ing.lab1.repository;

import austral.ing.lab1.model.Institution;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Institutions {

    private final EntityManager entityManager;

    public Institutions(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Institution> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Institution.class, id));
    }

    public Optional<Institution> findByEmail(String email) {
        return entityManager
                .createQuery("SELECT i FROM Institution i WHERE i.email LIKE :email", Institution.class)
                .setParameter("email", email)
                .getResultList()
                .stream()
                .findFirst();
    }

    public List<Institution> listAll() {
        return entityManager.createQuery("SELECT i FROM Institution i", Institution.class).getResultList();
    }

    public Institution persist(Institution institution) {
        entityManager.persist(institution);
        return institution;
    }


    public String findEmailByInstitutionName(String institutionName) {
        return entityManager
            .createQuery("SELECT i.email FROM Institution i WHERE i.institutionalName LIKE :name", String.class)
            .setParameter("name", institutionName)
            .getSingleResult();
    }

    public void delete(Institution institution) {
        entityManager.remove(institution);
    }
}


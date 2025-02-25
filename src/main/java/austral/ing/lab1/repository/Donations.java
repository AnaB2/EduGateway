package austral.ing.lab1.repository;

import austral.ing.lab1.model.Donation;
import austral.ing.lab1.model.DonationDTO;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class Donations {

    private final EntityManager entityManager;

    public Donations(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Donation> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Donation.class, id));
    }

    public List<Donation> listAll() {
        return entityManager.createQuery("SELECT d FROM Donation d", Donation.class).getResultList();
    }

    public List<DonationDTO> findByUserId(Long userId) {
        List<Donation> donations = entityManager.createQuery(
                        "SELECT d FROM Donation d JOIN FETCH d.institution WHERE d.user.id = :user_id", Donation.class)
                .setParameter("user_id", userId)
                .getResultList();

        return donations.stream().map(DonationDTO::new).collect(Collectors.toList());
    }

    public List<DonationDTO> findByInstitutionId(Long institutionId) {
        List<Donation> donations = entityManager.createQuery(
                        "SELECT d FROM Donation d JOIN FETCH d.user WHERE d.institution.id = :institution_id", Donation.class)
                .setParameter("institution_id", institutionId)
                .getResultList();

        return donations.stream().map(DonationDTO::new).collect(Collectors.toList());
    }


    public Donation persist(Donation donation) {
        entityManager.persist(donation);
        return donation;
    }

    public void delete(Donation donation) {
        entityManager.remove(donation);
    }
}

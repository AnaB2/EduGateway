package austral.ing.lab1.repository;

import austral.ing.lab1.model.Chat;
import austral.ing.lab1.model.Message;
import austral.ing.lab1.model.User;
import austral.ing.lab1.model.Institution;

import java.util.List;
import javax.persistence.EntityManager;
import java.util.Optional;
import javax.persistence.TypedQuery;

public class Chats {

    private EntityManager entityManager;

    public Chats(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Chat> findById(Long id) {
        Chat chat = entityManager.find(Chat.class, id);
        return chat != null ? Optional.of(chat) : Optional.empty();
    }

    public List<Chat> findByUserId(Long userId) {
        TypedQuery<Chat>
            query = entityManager.createQuery("SELECT c FROM Chat c WHERE c.user.id = :userId", Chat.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    public List<Chat> findByInstitutionId(Long institutionId) {
        TypedQuery<Chat> query = entityManager.createQuery("SELECT c FROM Chat c WHERE c.institution.id = :institutionId", Chat.class);
        query.setParameter("institutionId", institutionId);
        return query.getResultList();
    }

    public Optional<Chat> findChatByUserAndInstitution(User user, Institution institution) {
        TypedQuery<Chat> query = entityManager.createQuery(
            "SELECT c FROM Chat c WHERE c.user = :user AND c.institution = :institution", Chat.class);
        query.setParameter("user", user);
        query.setParameter("institution", institution);
        return query.getResultList().stream().findFirst();
    }


    public void persistMessage(Message message) {
        entityManager.persist(message);
    }

    // other methods as needed
}
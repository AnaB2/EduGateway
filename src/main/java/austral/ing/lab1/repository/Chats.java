package austral.ing.lab1.repository;

import austral.ing.lab1.model.Chat;
import austral.ing.lab1.model.Message;

import javax.persistence.EntityManager;
import java.util.Optional;

public class Chats {

    private EntityManager entityManager;

    public Chats(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Chat> findById(Long id) {
        Chat chat = entityManager.find(Chat.class, id);
        return chat != null ? Optional.of(chat) : Optional.empty();
    }

    public void persistMessage(Message message) {
        entityManager.persist(message);
    }

    // other methods as needed
}
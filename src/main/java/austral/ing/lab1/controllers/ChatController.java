package austral.ing.lab1.controllers;

import austral.ing.lab1.model.*;
import austral.ing.lab1.repository.Chats;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.NotificationService;
import austral.ing.lab1.repository.Users;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ChatController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleCreateChat = (Request request, Response response) -> {
        String body = request.body();
        Map<String, Object> formData = gson.fromJson(body, new TypeToken<Map<String, Object>>() {}.getType());

        if (formData.get("userId") == null || formData.get("email") == null) { //es el email de la institucion
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        Long userId = ((Number) formData.get("userId")).longValue();
        String email = (String) formData.get("email");

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users users = new Users(entityManager);
        Institutions institutions = new Institutions(entityManager);
        Chats chats = new Chats(entityManager);

        try {
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            User user = users.findById(userId).orElse(null);
            if (user == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            Institution institution1 = institutions.findByEmail(email).orElse(null);
            if (institution1 == null) {
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            Chat chat = new Chat(user, institution1);
            entityManager.persist(chat);

            tx.commit();

            response.type("application/json");
            return gson.toJson(Map.of(
                "message", "Chat created successfully",
                "chatId", chat.getId(),
                "participantName", user.getFirstName(),
                "institutionName", institution1.getInstitutionalName(),
                "institutionEmail", institution1.getEmail()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            response.status(500);
            return "{\"error\": \"An error occurred while creating the chat\"}";
        } finally {
            entityManager.close();
        }
    };


    public static Route handleSendMessage = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        if (formData.get("chatId").trim().isEmpty() ||
            formData.get("sender").trim().isEmpty() ||
            formData.get("content").trim().isEmpty() ||
            formData.get("receiverType").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        Long chatId = Long.parseLong(formData.get("chatId"));
        Long receiver = Long.valueOf(formData.get("receiver"));
        Long sender = Long.valueOf(formData.get("sender"));
        String content = formData.get("content");
        String receiverType = formData.get("receiverType");
        Long timestamp = System.currentTimeMillis();

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Chats chats = new Chats(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            Chat chat = chats.findById(chatId).orElse(null);
            if (chat == null) {
                response.status(404);
                return "{\"error\": \"Chat not found\"}";
            }

            Message message = new Message(sender, content, timestamp,receiver);
            chat.addMessage(message);
            chats.persistMessage(message);

            tx.commit();

            // Enviar notificación en tiempo real a través de WebSocket
            NotificationService notificationService = new NotificationService(entityManager);
            notificationService.sendMessageToOther(message, receiverType, receiver);

            response.type("application/json");
            return gson.toJson(Map.of("message", "Message sent successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while sending the message\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetChatMessages = (Request request, Response response) -> {
        String chatIdParam = request.params(":chatId");
        if (chatIdParam == null || chatIdParam.trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing chat ID\"}";
        }

        Long chatId = Long.parseLong(chatIdParam);

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Chats chats = new Chats(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            Chat chat = chats.findById(chatId).orElse(null);
            if (chat == null) {
                response.status(404);
                return "{\"error\": \"Chat not found\"}";
            }

            Set<Message> messages = chat.getMessages();
            List<MessageDTO> messageDTOs = messages.stream()
                    .map(MessageDTO::new)
                    .collect(Collectors.toList());

            tx.commit();
            response.type("application/json");
            return gson.toJson(messageDTOs);
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while fetching the messages\"}";
        } finally {
            entityManager.close();
        }
    };

    static class MessageDTO {
        private final Long id;
        private final Long sender;

        private final Long receiver;
        private final String content;
        private final Long timestamp;

        public MessageDTO(Message message) {
            this.id = message.getId();
            this.sender = message.getSender();
            this.content = message.getContent();
            this.timestamp = message.getTimestamp();
            this.receiver = message.getReceiver();
        }

        public Long getId() {
            return id;
        }

        public Long getSender() {
            return sender;
        }

        public Long getReceiver(){return receiver;}

        public String getContent() {
            return content;
        }

        public Long getTimestamp() {
            return timestamp;
        }
    }
}


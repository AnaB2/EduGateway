package austral.ing.lab1.controllers;

import austral.ing.lab1.model.*;
import austral.ing.lab1.repository.Chats;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.NotificationService;
import austral.ing.lab1.repository.Users;
import austral.ing.lab1.util.EntityManagers;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.HashMap;

public class ChatController {

    private static final Gson gson = new Gson();

    public static Route handleCreateChat = (Request request, Response response) -> {
        System.out.println("🔍 Starting chat creation process...");
        
        String body = request.body();
        System.out.println("📝 Request body: " + body);
        
        Map<String, Object> formData = gson.fromJson(body, new TypeToken<Map<String, Object>>() {}.getType());

        if (formData.get("userId") == null || formData.get("email") == null) { //es el email de la institucion
            System.err.println("❌ Missing fields in request");
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        Long userId;
        try {
            Object userIdObj = formData.get("userId");
            if (userIdObj instanceof Number) {
                userId = ((Number) userIdObj).longValue();
            } else if (userIdObj instanceof String) {
                userId = Long.parseLong((String) userIdObj);
            } else {
                throw new IllegalArgumentException("Invalid userId type: " + userIdObj.getClass());
            }
            System.out.println("👤 User ID: " + userId);
        } catch (Exception e) {
            System.err.println("❌ Invalid userId format: " + formData.get("userId") + " - " + e.getMessage());
            response.status(400);
            return "{\"error\": \"Invalid format for userId: " + e.getMessage() + "\"}";
        }
        String email = (String) formData.get("email");
        System.out.println("🏢 Institution email: " + email);

        EntityManager entityManager = EntityManagers.currentEntityManager();
        Users users = new Users(entityManager);
        Institutions institutions = new Institutions(entityManager);
        Chats chats = new Chats(entityManager);

        try {
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            System.out.println("🔄 Transaction started");

            User user = users.findById(userId).orElse(null);
            if (user == null) {
                System.err.println("❌ User not found with ID: " + userId);
                tx.rollback();
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }
            System.out.println("✅ User found: " + user.getEmail());

            Institution institution1 = institutions.findByEmail(email).orElse(null);
            if (institution1 == null) {
                System.err.println("❌ Institution not found with email: " + email);
                tx.rollback();
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }
            System.out.println("✅ Institution found: " + institution1.getInstitutionalName());

            // 🔍 Verificar si ya existe un chat entre el usuario y la institución
            System.out.println("🔍 Checking for existing chat...");
            Optional<Chat> existingChatOpt = chats.findChatByUserAndInstitution(user, institution1);
            
            if (existingChatOpt.isPresent()) {
                Chat existingChat = existingChatOpt.get();
                // Chat ya existe, devolver el ID del chat existente
                tx.commit();
                response.type("application/json");
                System.out.println("✅ Chat already exists with ID: " + existingChat.getId());
                return gson.toJson(Map.of(
                    "message", "Chat already exists", 
                    "chatId", existingChat.getId(),
                    "existed", true
                ));
            }

            // 🆕 Crear nuevo chat si no existe
            System.out.println("🆕 Creating new chat...");
            Chat chat = new Chat(user, institution1);
            entityManager.persist(chat);
            tx.commit();

            System.out.println("🆕 New chat created with ID: " + chat.getId());
            response.type("application/json");
            return gson.toJson(Map.of(
                "message", "Chat created successfully", 
                "chatId", chat.getId(),
                "existed", false
            ));
            
        } catch (Exception e) {
            System.err.println("💥 Exception in chat creation: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            
            // Rollback transaction if it's still active
            try {
                EntityTransaction tx = entityManager.getTransaction();
                if (tx != null && tx.isActive()) {
                    tx.rollback();
                    System.out.println("🔄 Transaction rolled back");
                }
            } catch (Exception rollbackException) {
                System.err.println("❌ Error during rollback: " + rollbackException.getMessage());
            }
            
            response.status(500);
            return "{\"error\": \"An error occurred while creating the chat: " + e.getMessage() + "\"}";
        } finally {
            EntityManagers.close();
        }
    };


    public static Route handleSendMessage = (Request request, Response response) -> {
        System.out.println("💬 Starting message sending process...");
        
        String body = request.body();
        System.out.println("📝 Request body: " + body);
        
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        if (formData.get("chatId").trim().isEmpty() ||
            formData.get("sender").trim().isEmpty() ||
            formData.get("content").trim().isEmpty() ||
            formData.get("receiverType").trim().isEmpty()) {
            System.err.println("❌ Missing fields in request");
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        Long chatId = Long.parseLong(formData.get("chatId"));
        Long receiver = Long.valueOf(formData.get("receiver"));
        Long sender = Long.valueOf(formData.get("sender"));
        String content = formData.get("content");
        String receiverType = formData.get("receiverType");
        Long timestamp = System.currentTimeMillis();

        System.out.println("💬 Chat ID: " + chatId);
        System.out.println("👤 Sender: " + sender);
        System.out.println("👥 Receiver: " + receiver + " (type: " + receiverType + ")");
        System.out.println("📄 Content: " + content);

        EntityManager entityManager = EntityManagers.currentEntityManager();
        Chats chats = new Chats(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            System.out.println("🔄 Transaction started");
            
            Chat chat = chats.findById(chatId).orElse(null);
            if (chat == null) {
                System.err.println("❌ Chat not found with ID: " + chatId);
                response.status(404);
                return "{\"error\": \"Chat not found\"}";
            }
            System.out.println("✅ Chat found: " + chat.getId());

            Message message = new Message(sender, content, timestamp, receiver);
            message.setChat(chat);  // 🔗 Establecer la relación con el chat
            chat.addMessage(message);
            chats.persistMessage(message);
            System.out.println("💾 Message persisted to database");

            tx.commit();
            System.out.println("✅ Transaction committed");

            // Enviar notificación en tiempo real a través de WebSocket
            System.out.println("📡 Sending WebSocket message...");
            NotificationService notificationService = new NotificationService(entityManager);
            notificationService.sendMessageToOther(message, receiverType, receiver);

            response.type("application/json");
            return gson.toJson(Map.of("message", "Message sent successfully"));
        } catch (Exception e) {
            System.err.println("💥 Exception in message sending: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            if (tx.isActive()) {
                tx.rollback();
                System.out.println("🔄 Transaction rolled back");
            }
            response.status(500);
            return "{\"error\": \"An error occurred while sending the message: " + e.getMessage() + "\"}";
        } finally {
            EntityManagers.close();
        }
    };

    public static Route handleGetChatMessages = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        Long userId = formData.get("userId") != null ? Long.parseLong(formData.get("userId")) : null;
        Long institutionId = formData.get("institutionId") != null ? Long.parseLong(formData.get("institutionId")) : null;

        EntityManager entityManager = EntityManagers.currentEntityManager();
        Chats chats = new Chats(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            List<Chat> chatList;
            if (userId != null) {
                chatList = chats.findByUserId(userId);
            } else {
                chatList = chats.findByInstitutionId(institutionId);
            }

            List<ChatDTO> chatDTOs = chatList.stream()
                .map(ChatDTO::new)
                .collect(Collectors.toList());

            tx.commit();
            response.type("application/json");
            return gson.toJson(chatDTOs);
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while fetching the chats\"}";
        } finally {
            EntityManagers.close();
        }
    };

    public static Route handleGetMessagesByChat = (Request request, Response response) -> {
        System.out.println("📨 Starting get messages by chat process...");
        
        String body = request.body();
        System.out.println("📝 Request body: " + body);
        
        Map<String, Object> formData = gson.fromJson(body, new TypeToken<Map<String, Object>>() {}.getType());

        if (formData.get("chatId") == null) {
            System.err.println("❌ Missing chatId in request");
            response.status(400);
            return "{\"error\": \"Missing chatId field\"}";
        }

        Long chatId;
        try {
            Object chatIdObj = formData.get("chatId");
            if (chatIdObj instanceof Number) {
                chatId = ((Number) chatIdObj).longValue();
            } else if (chatIdObj instanceof String) {
                chatId = Long.parseLong((String) chatIdObj);
            } else {
                throw new IllegalArgumentException("Invalid chatId type: " + chatIdObj.getClass());
            }
            System.out.println("💬 Chat ID: " + chatId);
        } catch (Exception e) {
            System.err.println("❌ Invalid chatId format: " + formData.get("chatId") + " - " + e.getMessage());
            response.status(400);
            return "{\"error\": \"Invalid format for chatId: " + e.getMessage() + "\"}";
        }

        EntityManager entityManager = EntityManagers.currentEntityManager();
        Chats chats = new Chats(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            System.out.println("🔄 Transaction started");
            
            Chat chat = chats.findById(chatId).orElse(null);
            if (chat == null) {
                System.err.println("❌ Chat not found with ID: " + chatId);
                tx.rollback();
                response.status(404);
                return "{\"error\": \"Chat not found\"}";
            }
            System.out.println("✅ Chat found: " + chat.getId());

            // Obtener mensajes del chat y ordenarlos por timestamp
            Set<Message> messages = chat.getMessages();
            System.out.println("📨 Found " + messages.size() + " messages");

            // Convertir a DTOs y ordenar por timestamp (más antiguos primero)
            List<Map<String, Object>> messageDTOs = messages.stream()
                .sorted((m1, m2) -> Long.compare(m1.getTimestamp(), m2.getTimestamp())) // Ordenar por timestamp ascendente
                .map(message -> {
                    Map<String, Object> messageMap = new HashMap<>();
                    messageMap.put("id", message.getId());
                    messageMap.put("sender", message.getSender());
                    messageMap.put("receiver", message.getReceiver());
                    messageMap.put("content", message.getContent());
                    messageMap.put("timestamp", message.getTimestamp());
                    return messageMap;
                })
                .collect(Collectors.toList());

            tx.commit();
            System.out.println("✅ Transaction committed");

            response.type("application/json");
            return gson.toJson(messageDTOs);
            
        } catch (Exception e) {
            System.err.println("💥 Exception in get messages: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            
            try {
                if (tx != null && tx.isActive()) {
                    tx.rollback();
                    System.out.println("🔄 Transaction rolled back");
                }
            } catch (Exception rollbackException) {
                System.err.println("❌ Error during rollback: " + rollbackException.getMessage());
            }
            
            response.status(500);
            return "{\"error\": \"An error occurred while getting messages: " + e.getMessage() + "\"}";
        } finally {
            EntityManagers.close();
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




    static class ChatDTO{
        private final Long id;
        private final Long userId;
        private final String userName;
        private final String userEmail;
        private final Long institutionId;
        private final String institutionName;
        private final String institutionEmail;


        public ChatDTO(Chat chat) {
            this.id = chat.getId();
            this.userId = chat.getUser().getId();
            this.userName = chat.getUser().getFirstName();
            this.userEmail = chat.getUser().getEmail();
            this.institutionId = chat.getInstitution().getId();
            this.institutionName = chat.getInstitution().getInstitutionalName();
            this.institutionEmail = chat.getInstitution().getEmail();
        }






    }

























}


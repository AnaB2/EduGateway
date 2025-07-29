package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Notification;
import austral.ing.lab1.util.EntityManagers;
import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Map;

public class NotificationController {

    private static final Gson gson = new Gson();

    // Obtener todas las notificaciones de un usuario
    public static Route handleGetUserNotifications = (Request request, Response response) -> {
        EntityManager entityManager = EntityManagers.currentEntityManager();
        
        try {
            String userIdParam = request.queryParams("userId");
            if (userIdParam == null) {
                response.status(400);
                return "{\"error\": \"userId parameter is required\"}";
            }
            
            Long userId = Long.parseLong(userIdParam);
            
            TypedQuery<Notification> query = entityManager.createQuery(
                "SELECT n FROM Notification n WHERE n.userId = :userId ORDER BY n.id DESC", 
                Notification.class
            );
            query.setParameter("userId", userId);
            
            List<Notification> notifications = query.getResultList();
            
            response.type("application/json");
            return gson.toJson(notifications);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.status(500);
            return "{\"error\": \"Error retrieving notifications: " + e.getMessage() + "\"}";
        }
    };

    // Obtener todas las notificaciones de una institución
    public static Route handleGetInstitutionNotifications = (Request request, Response response) -> {
        EntityManager entityManager = EntityManagers.currentEntityManager();
        
        try {
            String institutionIdParam = request.queryParams("institutionId");
            if (institutionIdParam == null) {
                response.status(400);
                return "{\"error\": \"institutionId parameter is required\"}";
            }
            
            Long institutionId = Long.parseLong(institutionIdParam);
            
            TypedQuery<Notification> query = entityManager.createQuery(
                "SELECT n FROM Notification n WHERE n.institutionId = :institutionId ORDER BY n.id DESC", 
                Notification.class
            );
            query.setParameter("institutionId", institutionId);
            
            List<Notification> notifications = query.getResultList();
            
            response.type("application/json");
            return gson.toJson(notifications);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.status(500);
            return "{\"error\": \"Error retrieving notifications: " + e.getMessage() + "\"}";
        }
    };

    // Contar notificaciones no leídas de un usuario
    public static Route handleGetUnreadCount = (Request request, Response response) -> {
        EntityManager entityManager = EntityManagers.currentEntityManager();
        
        try {
            String userIdParam = request.queryParams("userId");
            String institutionIdParam = request.queryParams("institutionId");
            
            Long count = 0L;
            
            if (userIdParam != null) {
                Long userId = Long.parseLong(userIdParam);
                TypedQuery<Long> query = entityManager.createQuery(
                    "SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.read = false", 
                    Long.class
                );
                query.setParameter("userId", userId);
                count = query.getSingleResult();
            } else if (institutionIdParam != null) {
                Long institutionId = Long.parseLong(institutionIdParam);
                TypedQuery<Long> query = entityManager.createQuery(
                    "SELECT COUNT(n) FROM Notification n WHERE n.institutionId = :institutionId AND n.read = false", 
                    Long.class
                );
                query.setParameter("institutionId", institutionId);
                count = query.getSingleResult();
            } else {
                response.status(400);
                return "{\"error\": \"userId or institutionId parameter is required\"}";
            }
            
            response.type("application/json");
            return gson.toJson(Map.of("unreadCount", count));
            
        } catch (Exception e) {
            e.printStackTrace();
            response.status(500);
            return "{\"error\": \"Error counting unread notifications: " + e.getMessage() + "\"}";
        }
    };

    // Marcar una notificación como leída
    public static Route handleMarkAsRead = (Request request, Response response) -> {
        EntityManager entityManager = EntityManagers.currentEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        
        try {
            String body = request.body();
            Map<String, String> requestData = gson.fromJson(body, Map.class);
            
            String notificationIdParam = requestData.get("notificationId");
            if (notificationIdParam == null) {
                response.status(400);
                return "{\"error\": \"notificationId is required\"}";
            }
            
            Long notificationId = Long.parseLong(notificationIdParam);
            
            tx.begin();
            
            Notification notification = entityManager.find(Notification.class, notificationId);
            if (notification == null) {
                response.status(404);
                return "{\"error\": \"Notification not found\"}";
            }
            
            notification.setRead(true);
            entityManager.merge(notification);
            
            tx.commit();
            
            response.type("application/json");
            return gson.toJson(Map.of("message", "Notification marked as read"));
            
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace();
            response.status(500);
            return "{\"error\": \"Error marking notification as read: " + e.getMessage() + "\"}";
        }
    };

    // Marcar todas las notificaciones como leídas
    public static Route handleMarkAllAsRead = (Request request, Response response) -> {
        EntityManager entityManager = EntityManagers.currentEntityManager();
        EntityTransaction tx = entityManager.getTransaction();
        
        try {
            String body = request.body();
            Map<String, String> requestData = gson.fromJson(body, Map.class);
            
            String userIdParam = requestData.get("userId");
            String institutionIdParam = requestData.get("institutionId");
            
            tx.begin();
            
            int updatedCount = 0;
            
            if (userIdParam != null) {
                Long userId = Long.parseLong(userIdParam);
                updatedCount = entityManager.createQuery(
                    "UPDATE Notification n SET n.read = true WHERE n.userId = :userId AND n.read = false"
                ).setParameter("userId", userId).executeUpdate();
            } else if (institutionIdParam != null) {
                Long institutionId = Long.parseLong(institutionIdParam);
                updatedCount = entityManager.createQuery(
                    "UPDATE Notification n SET n.read = true WHERE n.institutionId = :institutionId AND n.read = false"
                ).setParameter("institutionId", institutionId).executeUpdate();
            } else {
                response.status(400);
                return "{\"error\": \"userId or institutionId is required\"}";
            }
            
            tx.commit();
            
            response.type("application/json");
            return gson.toJson(Map.of("message", "All notifications marked as read", "updatedCount", updatedCount));
            
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace();
            response.status(500);
            return "{\"error\": \"Error marking all notifications as read: " + e.getMessage() + "\"}";
        }
    };
}
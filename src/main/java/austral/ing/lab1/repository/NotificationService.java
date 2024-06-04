package austral.ing.lab1.repository;

import austral.ing.lab1.model.Notification;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;

public class NotificationService {
  private EntityManager entityManager;

  public NotificationService(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public void sendNotification(Notification notification) {
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();
      entityManager.persist(notification);
      tx.commit();
      // Enviar notificación en tiempo real a través de WebSocket
      String message = "New notification: " + notification.getMessage();
      if (notification.getUserId() != null) {
        NotificationEndpoint.sendNotification(notification.getUserId(), message);
      } else if (notification.getInstitutionId() != null) {
        NotificationEndpoint.sendNotification(notification.getInstitutionId(), message);
      }
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      throw e;
    }
  }

  public List<Notification> getNotificationsByUserId(Long userId) {
    return entityManager.createQuery("SELECT n FROM Notification n WHERE n.userId = :userId", Notification.class)
        .setParameter("userId", userId)
        .getResultList();
  }

  public List<Notification> getNotificationsByInstitutionId(Long institutionId) {
    return entityManager.createQuery("SELECT n FROM Notification n WHERE n.institutionId = :institutionId", Notification.class)
        .setParameter("institutionId", institutionId)
        .getResultList();
  }

  public void markAsRead(Long notificationId) {
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();
      Notification notification = entityManager.find(Notification.class, notificationId);
      if (notification != null) {
        notification.setRead(true);
        entityManager.merge(notification);
      }
      tx.commit();
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      throw e;
    }
  }
}

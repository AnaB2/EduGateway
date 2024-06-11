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
        NotificationEndpoint.sendNotificationToUser(notification.getUserId(), message);
      } else if (notification.getInstitutionId() != null) {
        NotificationEndpoint.sendNotificationToInstitution(notification.getInstitutionId(), message);
      }
    } catch (Exception e) {
      if (tx.isActive()) {
        tx.rollback();
      }
      throw e;
    }
  }

  // Otros métodos sin cambios...
}

package austral.ing.lab1.repository;

import austral.ing.lab1.model.Chat;
import austral.ing.lab1.model.Message;
import austral.ing.lab1.model.Notification;
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


  public void sendMessageToOther(Message message, String receiverType, Long receiver){
    EntityTransaction tx = entityManager.getTransaction();
    try {
      tx.begin();
      entityManager.persist(message);
      tx.commit();

      // Enviar notificación en tiempo real a través de WebSocket
      String messageContent =  message.getContent() + " from " + message.getSender() + " to " + message.getReceiver();
      if (message.getSender() != null && message.getReceiver() != null) {
        if ("participant".equals(receiverType)) {
          NotificationEndpoint.sendMessageToUser(message.getSender(), messageContent);
        } else if ("institution".equals(receiverType)) {
          NotificationEndpoint.sendMessageToInstitution(message.getReceiver(), messageContent);
        }
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

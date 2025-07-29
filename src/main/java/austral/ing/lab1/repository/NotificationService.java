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
    try {
      // Enviar notificación en tiempo real a través de WebSocket
      String messageContent = "New message: " + message.getContent() + " from " + message.getSender();
      System.out.println("Sending WebSocket message to " + receiverType + " with ID: " + receiver);
      
      if (message.getSender() != null && receiver != null) {
        if ("participant".equals(receiverType)) {
          System.out.println("Sending message to user: " + receiver);
          NotificationEndpoint.sendMessageToUser(receiver, messageContent);
        } else if ("institution".equals(receiverType)) {
          System.out.println("Sending message to institution: " + receiver);
          NotificationEndpoint.sendMessageToInstitution(receiver, messageContent);
        } else {
          System.err.println("Unknown receiver type: " + receiverType);
        }
      } else {
        System.err.println("Sender or receiver is null - Sender: " + message.getSender() + ", Receiver: " + receiver);
      }
    } catch (Exception e) {
      System.err.println("Error in sendMessageToOther: " + e.getMessage());
      e.printStackTrace();
      throw e;
    }
  }


  // Otros métodos sin cambios...
}

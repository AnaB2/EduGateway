package austral.ing.lab1.repository;

import com.google.gson.Gson;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@WebSocket
public class NotificationEndpoint {

  private static final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();
  private static final Map<Long, Session> userSessions = new ConcurrentHashMap<>();
  private static final Map<Long, Session> institutionSessions = new ConcurrentHashMap<>();

  @OnWebSocketConnect
  public void onOpen(Session session) {
    sessions.add(session);
    System.out.println("WebSocket connection opened. Total sessions: " + sessions.size());
  }

  @OnWebSocketClose
  public void onClose(Session session, int statusCode, String reason) {
    sessions.remove(session);
    userSessions.values().remove(session);
    institutionSessions.values().remove(session);
  }

  @OnWebSocketError
  public void onError(Session session, Throwable throwable) {
    sessions.remove(session);
    userSessions.values().remove(session);
    institutionSessions.values().remove(session);
    throwable.printStackTrace();
  }

  @OnWebSocketMessage
  public void onMessage(Session session, String message) throws IOException {
    try {
      System.out.println("WebSocket received message: " + message);
      
      // Parse JSON with proper type handling
      Map<String, Object> data = new Gson().fromJson(message, Map.class);
      
      // Handle ping/heartbeat messages
      if ("ping".equals(data.get("type"))) {
        session.getRemote().sendString("pong");
        return;
      }
      
      // Handle user registration
      if (data.containsKey("userId")) {
        Object userIdObj = data.get("userId");
        Long userId;
        
        if (userIdObj instanceof Number) {
          userId = ((Number) userIdObj).longValue();
        } else if (userIdObj instanceof String) {
          userId = Long.parseLong((String) userIdObj);
        } else {
          throw new IllegalArgumentException("Invalid userId format");
        }
        
        userSessions.put(userId, session);
        System.out.println("User session registered: " + userId);
        session.getRemote().sendString("User session registered");
        return;
      } 
      
      // Handle institution registration
      if (data.containsKey("institutionId")) {
        Object institutionIdObj = data.get("institutionId");
        Long institutionId;
        
        if (institutionIdObj instanceof Number) {
          institutionId = ((Number) institutionIdObj).longValue();
        } else if (institutionIdObj instanceof String) {
          institutionId = Long.parseLong((String) institutionIdObj);
        } else {
          throw new IllegalArgumentException("Invalid institutionId format");
        }
        
        institutionSessions.put(institutionId, session);
        System.out.println("Institution session registered: " + institutionId);
        session.getRemote().sendString("Institution session registered");
        return;
      }
      
      // If we get here, the message format is not recognized
      session.getRemote().sendString("Message format not recognized");
      
    } catch (NumberFormatException e) {
      System.err.println("Error parsing ID in WebSocket message: " + e.getMessage());
      session.getRemote().sendString("Error: Invalid ID format");
    } catch (Exception e) {
      System.err.println("Error processing WebSocket message: " + e.getMessage());
      e.printStackTrace();
      session.getRemote().sendString("Error processing message");
    }
  }

  public static void sendNotificationToUser(Long userId, String message) {
    System.out.println("Attempting to send notification to user " + userId + ": " + message);
    Session session = userSessions.get(userId);
    if (session != null && session.isOpen()) {
      try {
        session.getRemote().sendString(message);
        System.out.println("✅ Notification sent successfully to user " + userId);
      } catch (IOException e) {
        System.err.println("❌ Error sending notification to user " + userId + ": " + e.getMessage());
        e.printStackTrace();
      }
    } else {
      System.out.println("⚠️ No active session found for user " + userId + ". Total user sessions: " + userSessions.size());
    }
  }

  public static void sendNotificationToInstitution(Long institutionId, String message) {
    Session session = institutionSessions.get(institutionId);
    if (session != null && session.isOpen()) {
      try {
        session.getRemote().sendString(message);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }


  public static void sendMessageToInstitution(Long institutionId, String message) {
    Session session = institutionSessions.get(institutionId);
    if (session != null && session.isOpen()) {
      try {
        session.getRemote().sendString(message);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }



  public static void sendMessageToUser(Long userId, String message) {
    Session session = userSessions.get(userId);
    if (session != null && session.isOpen()) {
      try {
        session.getRemote().sendString(message);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }







}




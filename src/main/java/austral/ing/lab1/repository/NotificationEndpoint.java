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
    // Assume message is JSON with userId or institutionId
    // Example: {"userId": "123"}
    // Example: {"institutionId": "456"}

    // Parse JSON
    Map<String, Object> data = new Gson().fromJson(message, Map.class);
    if (data.containsKey("userId")) {
      Long userId = ((Double) data.get("userId")).longValue();
      userSessions.put(userId, session);
    } else if (data.containsKey("institutionId")) {
      Long institutionId = ((Double) data.get("institutionId")).longValue();
      institutionSessions.put(institutionId, session);
    }

    session.getRemote().sendString("Session registered");
  }

  public static void sendNotificationToUser(Long userId, String message) {
    Session session = userSessions.get(userId);
    if (session != null && session.isOpen()) {
      try {
        session.getRemote().sendString(message);
      } catch (IOException e) {
        e.printStackTrace();
      }
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




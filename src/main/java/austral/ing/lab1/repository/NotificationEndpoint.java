package austral.ing.lab1.repository;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@WebSocket
public class NotificationEndpoint {

  private static final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();

  @OnWebSocketConnect
  public void onOpen(Session session) {
    sessions.add(session);
  }

  @OnWebSocketClose
  public void onClose(Session session, int statusCode, String reason) {
    sessions.remove(session);
  }

  @OnWebSocketError
  public void onError(Session session, Throwable throwable) {
    sessions.remove(session);
    throwable.printStackTrace();
  }

  @OnWebSocketMessage
  public void onMessage(Session session, String message) throws IOException {
    session.getRemote().sendString(message);
  }

  public static void sendNotification(Long id, String message) {
    for (Session session : sessions) {
      if (session.isOpen() && session.getRemote().toString().equals(id.toString())) {
        try {
          session.getRemote().sendString(message);
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }
}
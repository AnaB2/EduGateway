package austral.ing.lab1.repository;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/notifications/")
public class NotificationEndpoint {

  private static final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();

  @OnOpen
  public void onOpen(Session session) {
    sessions.add(session);
  }

  @OnClose
  public void onClose(Session session) {
    sessions.remove(session);
  }

  @OnError
  public void onError(Session session, Throwable throwable) {
    sessions.remove(session);
    throwable.printStackTrace();
  }

  @OnMessage
  public void onMessage(String message, Session session) throws IOException {
    session.getBasicRemote().sendText(message);
  }

  public static void sendNotification(Long id, String message) {
    for (Session session : sessions) {
      if (session.isOpen() && session.getId().equals(id.toString())) {
        session.getAsyncRemote().sendText(message);
      }
    }
  }
}
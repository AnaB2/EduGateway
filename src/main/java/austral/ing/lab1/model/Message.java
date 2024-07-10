package austral.ing.lab1.model;

import javax.persistence.*;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private  Long sender;

    private Long receiver;
    private String content;
    private Long timestamp;

    @ManyToOne
    private Chat chat;

    public Message() {
    }

    public Message(Long sender, String content, Long timestamp, Long receiver) {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
        this.receiver = receiver;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSender() {
        return sender;
    }

    public Long getReceiver(){return receiver;}

    public void setReceiver(Long receiver){this.receiver = receiver;}

    public void setSender(Long sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }
}
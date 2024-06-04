package austral.ing.lab1.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class Notification {
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long id;

  private String message;
  private Long userId;
  private Long institutionId;
  private boolean read;

  public Notification(){

  }


  public Notification(String message, Long userId, Long institutionId) {
    this.message = message;
    this.userId = userId;
    this.institutionId = institutionId;
    this.read = false;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getInstitutionId() {
    return institutionId;
  }

  public void setInstitutionId(Long institutionId) {
    this.institutionId = institutionId;
  }

  public boolean isRead() {
    return read;
  }

  public void setRead(boolean read) {
    this.read = read;
  }

}

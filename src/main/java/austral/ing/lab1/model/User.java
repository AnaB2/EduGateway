package austral.ing.lab1.model;


import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {

  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long id;

  @Column(name = "FIRST_NAME")
  private String firstName;

  @Column(name = "LAST_NAME")
  private String lastName;

  @Column(name = "EMAIL", nullable = false, unique = true)
  private String email;

  @Column(name = "PASSWORD")
  private String password;

  public User() { }

  public static UserBuilder create(String email) {
    return new UserBuilder(email);
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }


  public void setPassword(String password) {
    this.password = password;
  }

  public String getPassword() {
    return password;
  }

  private User(UserBuilder builder) {
    this.firstName = builder.firstName;
    this.lastName = builder.lastName;
    this.password = builder.password;
    this.email = builder.email;
  }

  public static User fromJson(String json) {
    final Gson gson = new Gson();
    return gson.fromJson(json, User.class);
  }

  public String asJson() {
    Gson gson = new Gson();
    return gson.toJson(this);
  }

  public void setActive(boolean b) {
  }

  public static class UserBuilder {
    private final String email;
    private String firstName;
    private String lastName;
    private String password;

    public UserBuilder(String email) {
      this.email = email;
    }

    public UserBuilder password(String password) {
      this.password = password;
      return this;
    }

    public UserBuilder firstName(String firstName) {
      this.firstName = firstName;
      return this;
    }

    public UserBuilder lastName(String lastName) {
      this.lastName = lastName;
      return this;
    }


    public User build() {
      return new User(this);
    }

  }
}

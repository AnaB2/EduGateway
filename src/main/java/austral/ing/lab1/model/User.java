package austral.ing.lab1.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

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

  @Column(name = "DESCRIPTION")
  private String description;




  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "user_followed_institutions",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "institution_id")
  )
  private Set<Institution> followedInstitutions = new HashSet<>();

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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  private User(UserBuilder builder) {
    this.firstName = builder.firstName;
    this.lastName = builder.lastName;
    this.password = builder.password;
    this.email = builder.email;
    this.description = builder.description;
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

  public void followInstitution(Institution institution) {
    followedInstitutions.add(institution);
    institution.getFollowers().add(this);
  }

  public Set<Institution> getFollowedInstitutions() {
    return followedInstitutions;
  }

  public static class UserBuilder {
    private final String email;
    private String firstName;
    private String lastName;
    private String password;
    private String description;

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

    public UserBuilder description(String description) {
      this.description = description;
      return this;
    }


    public User build() {
      return new User(this);
    }

  }
}

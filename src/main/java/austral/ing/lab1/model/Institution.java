package austral.ing.lab1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Institution {

    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long id;

    @Column(name = "INSTITUTIONAL_NAME")
    private String institutionalName;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "CREDENTIAL")
    private String credential;

    @Column(name = "DESCRIPTION")
    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "followedInstitutions", fetch = FetchType.LAZY)
    private Set<User> followers = new HashSet<>();

    public Institution() { }

    public static InstitutionBuilder create(String email) {
        return new InstitutionBuilder(email);
    }

    public String getInstitutionalName() {
        return institutionalName;
    }

    public void setInstitutionalName(String institutionalName) {
        this.institutionalName = institutionalName;
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

    public void setCredential(String credential) {
        this.credential = credential;
    }

    public String getCredential() {
        return credential;
    }

    public Set<User> getFollowers() {
        return followers;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setFollowers(Set<User> followers) {
        this.followers = followers;
    }

    Institution(InstitutionBuilder builder) {
        this.institutionalName = builder.institutionalName;
        this.password = builder.password;
        this.email = builder.email;
        this.credential = builder.credential;
        this.description = builder.description;
    }

    public static Institution fromJson(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, Institution.class);
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    public void setActive(boolean b) {
    }

    public static class InstitutionBuilder {
        private final String email;
        private String institutionalName;
        private String password;
        private String credential;
        private String description;

        public InstitutionBuilder(String email) {
            this.email = email;
        }

        public InstitutionBuilder institutionalName(String institutionalName) {
            this.institutionalName = institutionalName;
            return this;
        }

        public InstitutionBuilder password(String password) {
            this.password = password;
            return this;
        }

        public InstitutionBuilder credential(String credential) {
            this.credential = credential;
            return this;
        }

        public Institution build() {
            return new Institution(this);
        }
    }
}
package austral.ing.lab1.model;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class Institution extends User {
    @Column(name = "CREDENTIAL")
    private String credential;

    public Institution() {
        super();
    }

    public Institution(UserBuilder email, String credential) {
        super(email);
        this.credential = credential;
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }
}



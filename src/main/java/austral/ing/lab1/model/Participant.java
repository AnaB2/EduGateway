package austral.ing.lab1.model;

import javax.persistence.Entity;

@Entity
public class Participant extends User {
    public Participant() {
        super();
    }

    public Participant(UserBuilder email) {
        super(email);
    }
}


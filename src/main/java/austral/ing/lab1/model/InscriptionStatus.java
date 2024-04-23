package austral.ing.lab1.model;

public enum InscriptionStatus {
  PENDING("Pendiente"),
  ACCEPTED("Aceptada"),
  REJECTED("Rechazada");

  private final String status;

  InscriptionStatus(String status) {
    this.status = status;
  }

  public String getStatus() {
    return status;
  }
}


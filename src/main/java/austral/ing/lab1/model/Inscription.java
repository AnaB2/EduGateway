package austral.ing.lab1.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class Inscription {

  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long id;

  @Column(name = "opportunity_id")
  private  Long  opportunity;

  @Column(name = "email_participante")
  private String emailParticipante;

  @Column(name = "nombre")
  private String nombre;

  @Column(name = "apellido")
  private String apellido;

  @Column(name = "localidad")
  private String localidad;

  @Column(name = "estado")
  @Enumerated(EnumType.STRING)
  private InscriptionStatus estado; // Estado de la inscripción (aceptada, rechazada, pendiente, etc.)

  public Inscription() {
  }


  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getOpportunityID() {
    return opportunity;
  }

  public void setOpportunityID(Long opportunity) {
    this.opportunity = opportunity;
  }

  public String getEmailParticipante() {
    return emailParticipante;
  }

  public void setEmailParticipante(String emailParticipante) {
    this.emailParticipante = emailParticipante;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getApellido() {
    return apellido;
  }

  public void setApellido(String apellido) {
    this.apellido = apellido;
  }

  public String getLocalidad() {
    return localidad;
  }

  public void setLocalidad(String localidad) {
    this.localidad = localidad;
  }

  public InscriptionStatus getEstado() {
    return estado;
  }

  public void setEstado(InscriptionStatus estado) {
    this.estado = estado;
  }
}

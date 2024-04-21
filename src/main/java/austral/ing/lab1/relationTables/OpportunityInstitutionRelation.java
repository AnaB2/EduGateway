package austral.ing.lab1.relationTables;

import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.Opportunity;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class OpportunityInstitutionRelation {

  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long id;

  @ManyToOne
  @JoinColumn(name = "opportunity_id")
  private Opportunity opportunity;

  @ManyToOne
  @JoinTable(
      name = "institution_email_join",
      joinColumns = @JoinColumn(name = "opportunity_institution_relation_id"),
      inverseJoinColumns = @JoinColumn(name = "institution_email")
  )
  private Institution institution;

  public OpportunityInstitutionRelation() { }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Opportunity getOpportunity() {
    return opportunity;
  }

  public void setOpportunity(Opportunity opportunity) {
    this.opportunity = opportunity;
  }

  public Institution getInstitution() {
    return institution;
  }

  public void setInstitution(Institution institution) {
    this.institution = institution;
  }
}
package austral.ing.lab1.repository;

import austral.ing.lab1.relationTables.OpportunityInstitutionRelation;
import javax.persistence.EntityManager;

// This class is used to persist the OpportunityInstitutionRelation entity in the database.

public class OIRelation {
  private final EntityManager entityManager;


  public OIRelation(EntityManager entityManager) {
    this.entityManager = entityManager;
  }


  public OpportunityInstitutionRelation persist(OpportunityInstitutionRelation relation) {
    entityManager.persist(relation);
    return relation;
  }





}



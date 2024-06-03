package austral.ing.lab1.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class InstitutionDTO {
  private Long id;
  private String institutionalName;
  private String email;

  private List<UserDTO> followers = new ArrayList<>();

  // constructor que acepta un objeto Institution
  public InstitutionDTO(Institution institution) {
    this.id = institution.getId();
    this.institutionalName = institution.getInstitutionalName();
    this.email = institution.getEmail();
    this.followers = institution.getFollowers().stream()
        .map(UserDTO::new)
        .collect(Collectors.toList());
  }

  // getters y setters
}
package austral.ing.lab1.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class UserDTO {
  private Long id;
  private String firstName;
  private String lastName;
  private String email;

  private List<InstitutionDTO> followedInstitutions = new ArrayList<>();

  // constructor que acepta un objeto User
  public UserDTO(User user) {
    this.id = user.getId();
    this.firstName = user.getFirstName();
    this.lastName = user.getLastName();
    this.email = user.getEmail();
    this.followedInstitutions = user.getFollowedInstitutions().stream()
        .map(InstitutionDTO::new)
        .collect(Collectors.toList());
  }


  public List<InstitutionDTO> getFollowedInstitutions() {
    return followedInstitutions;
  }

  // getters y setters
}
package austral.ing.lab1.model;

import java.math.BigDecimal;

public class DonationDTO {
    private Long id;
    private String userName;
    private String institutionName;
    private BigDecimal amount;
    private String donationDate;

    public DonationDTO(Donation donation) {
        this.id = donation.getId();
        this.userName = donation.getUser() != null ? donation.getUser().getFirstName() + " " + donation.getUser().getLastName() : "Anonymous";
        this.institutionName = donation.getInstitution().getInstitutionalName();
        this.amount = donation.getAmount();
        this.donationDate = donation.getDonationDate().toString();
    }

}


package austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class Opportunity {

    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long id;

    @ManyToOne
    private Institution institution;

    @Column(name = "OPPORTUNITY_NAME")
    private String name;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "REGION")
    private String region;

    @Column(name = "CITY")
    private String city;

    @Column(name = "EDUCATIONAL_LEVEL")
    private String educationalLevel;

    @Column(name = "LANGUAGE")
    private String language;

    @Column(name = "VACANCIES")
    private int vacancies;

    public Opportunity() { }

    public Opportunity(Institution institution, String name, String category, String region, String city,
                       String educationalLevel, String language, int vacancies) {
        this.institution = institution;
        this.name = name;
        this.category = category;
        this.region = region;
        this.city = city;
        this.educationalLevel = educationalLevel;
        this.language = language;
        this.vacancies = vacancies;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Institution getInstitution() {
        return institution;
    }

    public void setInstitution(Institution institution) {
        this.institution = institution;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getEducationalLevel() {
        return educationalLevel;
    }

    public void setEducationalLevel(String educationalLevel) {
        this.educationalLevel = educationalLevel;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public int getVacancies() {
        return vacancies;
    }

    public void setVacancies(int vacancies) {
        this.vacancies = vacancies;
    }
}

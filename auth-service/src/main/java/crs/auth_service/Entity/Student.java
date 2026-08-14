package crs.auth_service.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(unique = true, length = 100)
    private String mssv;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id",
            unique = true
    )
    private User user;
}
package com.webthuongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userID;

    // Ép Spring Boot map đúng vào cột FullName thay vì full_name
    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Column(name = "Email", unique = true, nullable = false)
    private String email;

    // Ép map đúng vào PasswordHash
    @Column(name = "PasswordHash", nullable = false)
    private String password;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Birthday")
    private java.sql.Date birthday;

    @Column(name = "Gender")
    private String gender;

    @Column(name = "FollowerCount")
    private Integer followerCount = 0;

    @Column(name = "Status")
    private String status = "Active";

    @Column(name = "LastLoginDate")
    private LocalDateTime lastLoginDate;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "DeletedAt")
    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinTable(
            name = "User_Roles", // Tên bảng trung gian trong SQL
            joinColumns = @JoinColumn(name = "UserID"), // Cột nối với bảng Users
            inverseJoinColumns = @JoinColumn(name = "RoleID") // Cột nối với bảng Roles
    )
    private Role role;
}
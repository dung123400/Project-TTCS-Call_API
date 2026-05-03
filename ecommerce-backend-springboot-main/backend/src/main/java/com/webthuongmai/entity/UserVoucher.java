package com.webthuongmai.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "user_vouchers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userid", "voucherid"})
})
public class UserVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    @ManyToOne
    @JoinColumn(name = "voucherid")
    private Voucher voucher;

    @Column(name = "is_used")
    private Boolean isUsed = false;

    @Column(name = "saved_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date savedAt = new Date();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Voucher getVoucher() { return voucher; }
    public void setVoucher(Voucher voucher) { this.voucher = voucher; }

    public Boolean getIsUsed() { return isUsed; }
    public void setIsUsed(Boolean isUsed) { this.isUsed = isUsed; }

    public Date getSavedAt() { return savedAt; }
    public void setSavedAt(Date savedAt) { this.savedAt = savedAt; }
}
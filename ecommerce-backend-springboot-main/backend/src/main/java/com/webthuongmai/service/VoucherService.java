package com.webthuongmai.service;
import com.webthuongmai.entity.Voucher;
import com.webthuongmai.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    public Voucher createVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }
}
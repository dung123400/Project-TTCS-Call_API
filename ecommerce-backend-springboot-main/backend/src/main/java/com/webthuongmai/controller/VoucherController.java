package com.webthuongmai.controller;
import com.webthuongmai.entity.Voucher;
import com.webthuongmai.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin("*")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping
    public List<Voucher> getAll() {
        return voucherService.getAllVouchers();
    }

    @PostMapping
    public Voucher create(@RequestBody Voucher voucher) {
        return voucherService.createVoucher(voucher);
    }
}
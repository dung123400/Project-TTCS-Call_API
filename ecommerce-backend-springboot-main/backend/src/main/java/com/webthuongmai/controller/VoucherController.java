package com.webthuongmai.controller;
import com.webthuongmai.entity.Voucher;
import com.webthuongmai.repository.VoucherRepository;
import com.webthuongmai.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin("*")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @Autowired
    private VoucherRepository voucherRepository;

    @GetMapping
    public List<Voucher> getAll() {
        return voucherService.getAllVouchers();
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Voucher>> getVouchersByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(voucherRepository.findByShop_ShopID(shopId));
    }

    @GetMapping("/type")
    public ResponseEntity<List<Voucher>> getVouchersByType(@RequestParam String type) {
        return ResponseEntity.ok(voucherService.getVouchersByType(type));
    }

    @PostMapping
    public Voucher create(@RequestBody Voucher voucher) {
        return voucherService.createVoucher(voucher);
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveVoucher(
            @RequestParam Long userId,
            @RequestParam Long voucherId) {
        String message = voucherService.saveVoucherToWallet(userId, voucherId);
        if (message.contains("thành công")) {
            return ResponseEntity.ok(message);
        }
        return ResponseEntity.badRequest().body(message);
    }
}
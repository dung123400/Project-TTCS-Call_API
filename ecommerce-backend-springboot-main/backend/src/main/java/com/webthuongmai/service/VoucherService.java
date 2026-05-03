package com.webthuongmai.service;
import com.webthuongmai.entity.UserVoucher;
import com.webthuongmai.entity.Voucher;
import com.webthuongmai.entity.User;
import com.webthuongmai.repository.UserRepository;
import com.webthuongmai.repository.UserVoucherRepository;
import com.webthuongmai.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserVoucherRepository userVoucherRepository;


    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    public Voucher createVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    public String saveVoucherToWallet(Long userId, Long voucherId) {
        if (userVoucherRepository.existsByUser_UserIDAndVoucher_VoucherID(userId, voucherId)) {
            return "Voucher này đã có trong ví của bạn!";
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        UserVoucher uv = new UserVoucher();
        uv.setUser(user);
        uv.setVoucher(voucher);
        uv.setIsUsed(false);

        userVoucherRepository.save(uv);
        return "Lưu Voucher thành công!";
    }

    public List<Voucher> getVouchersByType(String type) {
        return voucherRepository.findByVoucherTypeAndStatus(type, "Active");
    }

}
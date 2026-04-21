package com.webthuongmai.controller;
import com.webthuongmai.entity.Address;
import com.webthuongmai.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin("*")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @GetMapping
    public List<Address> getAll() {
        return addressService.getAllAddresses();
    }

    @PostMapping
    public Address create(@RequestBody Address address) {
        return addressService.createAddress(address);
    }
}
package com.webthuongmai.service;
import com.webthuongmai.entity.Address;
import com.webthuongmai.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    public Address createAddress(Address address) {
        return addressRepository.save(address);
    }
}
package com.FoodieApp.RegisteredUser.service;

import com.FoodieApp.RegisteredUser.model.Customer;
import com.FoodieApp.RegisteredUser.model.CustomerAddress;
import com.FoodieApp.RegisteredUser.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
    

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    public Customer addCustomer(Customer customer) {
        // Assuming profile image URL, if needed, is already set in `customer`
        return customerRepository.save(customer);
    }
    

    public Customer updateCustomer(String id, Customer customerDetails) {
        return customerRepository.findById(id)
            .map(customer -> {
                // Set all fields from customerDetails
                customer.setFirstName(customerDetails.getFirstName());
                customer.setLastName(customerDetails.getLastName());
                customer.setGender(customerDetails.getGender());
                //customer.setEmail(customerDetails.getEmail());
                customer.setPassword(customerDetails.getPassword());
                customer.setCustomerAddress(customerDetails.getCustomerAddress());
                customer.setPhone(customerDetails.getPhone());
                customer.setCustomerOrders(customerDetails.getCustomerOrders());
                customer.setFavourites(customerDetails.getFavourites());
                customer.setCustomerCart(customerDetails.getCustomerCart());
                customer.setCustomerRating(customerDetails.getCustomerRating());
                customer.setProfileImageUrl(customerDetails.getProfileImageUrl()); // Set profile image URL
    
                return customerRepository.save(customer);
            })
            .orElseGet(() -> {
                // If customer not found, set id and save customerDetails directly
                customerDetails.setEmail(id);
                return customerRepository.save(customerDetails);
            });
    }
    

    public void deleteCustomer(String id) {
        customerRepository.deleteById(id);
    }

   


}

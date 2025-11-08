package com.FoodieApp.RegisteredUser.controller;

import com.FoodieApp.RegisteredUser.model.Customer;
import com.FoodieApp.RegisteredUser.model.CustomerAddress;
import com.FoodieApp.RegisteredUser.model.CustomerOrders;
import com.FoodieApp.RegisteredUser.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable String id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // @PostMapping
    // public Customer addCustomer(@RequestPart("customer") Customer customer,
    // @RequestParam(value = "imageUrl", required = false) String imageUrl) {
    // return customerService.addCustomer(customer, imageUrl);
    // }

    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return customerService.addCustomer(customer); // Set imageUrl to null if not used
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<Customer> updateCustomer(@PathVariable String id,
    // @RequestPart("customer") Customer customerDetails,
    // @RequestParam(value = "imageUrl", required = false) String imageUrl) {
    // Customer updatedCustomer = customerService.updateCustomer(id,
    // customerDetails, imageUrl);
    // return ResponseEntity.ok(updatedCustomer);
    // }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable String id, @RequestBody Customer customerDetails) {
        Customer updatedCustomer = customerService.updateCustomer(id, customerDetails);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    // @PatchMapping("/{id}/orders")
    // public ResponseEntity<Customer> updateCustomerOrders(@PathVariable String id,
    // @RequestBody List<CustomerOrders> customerOrders) {
    // Optional<Customer> customerOptional = customerService.getCustomerById(id);
    // if (customerOptional.isPresent()) {
    // Customer customer = customerOptional.get();
    // customer.setCustomerOrders(customerOrders);
    // customerService.saveCustomer(customer);
    // return ResponseEntity.ok(customer);
    // }
    // return ResponseEntity.notFound().build();
    // }

    // @PatchMapping("/{id}/orders")
    // public ResponseEntity<Customer> updateCustomerOrders(@PathVariable String id,
    // @RequestBody List<CustomerOrders> customerOrders) {
    // Optional<Customer> customerOptional = customerService.getCustomerById(id);
    // if (customerOptional.isPresent()) {
    // Customer customer = customerOptional.get();
    // customer.setCustomerOrders(customerOrders);
    // customerService.saveCustomer(customer);
    // return ResponseEntity.ok(customer);
    // }
    // return ResponseEntity.notFound().build();
    // }

    @PatchMapping("/{id}/orders")
    public ResponseEntity<Customer> updateCustomerOrders(@PathVariable String id,
            @RequestBody CustomerOrders newOrder) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();

            // Retrieve the existing orders
            List<CustomerOrders> existingOrders = customer.getCustomerOrders();

            // Check if the existingOrders list is null; if it is, initialize it
            if (existingOrders == null) {
                existingOrders = new ArrayList<>();
            }

            // Add the new order to the existing orders
            existingOrders.add(newOrder);

            // Set the updated list back to the customer
            customer.setCustomerOrders(existingOrders);

            // Save the customer with the updated orders
            customerService.saveCustomer(customer);

            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/favourites")
    public ResponseEntity<Customer> updateFavourites(@PathVariable String id,
            @RequestBody List<String> favourites) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customer.setFavourites(favourites);
            customerService.saveCustomer(customer);
            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.notFound().build();
    }

    // @PatchMapping("/{id}/cart")
    // public ResponseEntity<Customer> updateCustomerCart(@PathVariable String id,
    // @RequestBody List<String> customerCart) {
    // Optional<Customer> customerOptional = customerService.getCustomerById(id);
    // if (customerOptional.isPresent()) {
    // Customer customer = customerOptional.get();
    // customer.setCustomerCart(customerCart);
    // customerService.saveCustomer(customer);
    // return ResponseEntity.ok(customer);
    // }
    // return ResponseEntity.notFound().build();
    // }

    @PatchMapping("/{id}/cart")
    public ResponseEntity<Customer> updateCustomerCart(@PathVariable String id,
            @RequestBody List<String> customerCart) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();

            // Instead of adding to the existing cart, replace it with the incoming
            // customerCart
            customer.setCustomerCart(customerCart);

            // Save the updated customer
            customerService.saveCustomer(customer);
            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/rating")
    public ResponseEntity<Customer> updateCustomerRating(@PathVariable String id,
            @RequestBody Map<String, Integer> customerRating) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customer.setCustomerRating(customerRating);
            customerService.saveCustomer(customer);
            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/cart")
    public ResponseEntity<List<String>> getCustomerCart(@PathVariable String id) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            return ResponseEntity.ok(customerOptional.get().getCustomerCart());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/favourites")
    public ResponseEntity<List<String>> getFavourites(@PathVariable String id) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            return ResponseEntity.ok(customerOptional.get().getFavourites());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<CustomerOrders>> getCustomerOrders(@PathVariable String id) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            return ResponseEntity.ok(customerOptional.get().getCustomerOrders());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<Map<String, Integer>> getCustomerRating(@PathVariable String id) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            return ResponseEntity.ok(customerOptional.get().getCustomerRating());
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/address")
    public ResponseEntity<Customer> addCustomerAddress(@PathVariable String id,
            @RequestBody CustomerAddress newAddress) {
        Optional<Customer> customerOptional = customerService.getCustomerById(id);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();

            // Retrieve the existing addresses
            List<CustomerAddress> existingAddresses = customer.getCustomerAddress();

            // Check if the existingAddresses list is null; if it is, initialize it
            if (existingAddresses == null) {
                existingAddresses = new ArrayList<>();
            }

            // Add the new address to the existing list
            existingAddresses.add(newAddress);

            // Set the updated list back to the customer
            customer.setCustomerAddress(existingAddresses);

            // Save the customer with the updated addresses
            customerService.saveCustomer(customer);

            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Update address by addressId (string)
@PatchMapping("/{id}/address/{addressId}")
public ResponseEntity<Customer> updateCustomerAddress(
        @PathVariable String id,
        @PathVariable String addressId,
        @RequestBody CustomerAddress updatedAddress) {

    Optional<Customer> customerOptional = customerService.getCustomerById(id);

    if (customerOptional.isPresent()) {
        Customer customer = customerOptional.get();
        List<CustomerAddress> addresses = customer.getCustomerAddress();

        if (addresses == null || addresses.isEmpty()) {
            return ResponseEntity.badRequest().build(); // no addresses to update
        }

        boolean updated = false;

        for (int i = 0; i < addresses.size(); i++) {
            CustomerAddress existing = addresses.get(i);
            if (existing.getAddressId() != null && existing.getAddressId().equals(addressId)) {
                // Replace the existing address with updated one
                addresses.set(i, updatedAddress);
                updated = true;
                break;
            }
        }

        if (!updated) {
            return ResponseEntity.notFound().build(); // addressId not found
        }

        customer.setCustomerAddress(addresses);
        customerService.saveCustomer(customer);

        return ResponseEntity.ok(customer);
    }

    return ResponseEntity.notFound().build();
}

// ✅ Delete address by addressId (string)
@DeleteMapping("/{id}/address/{addressId}")
public ResponseEntity<Customer> deleteCustomerAddress(
        @PathVariable String id,
        @PathVariable String addressId) {

    Optional<Customer> customerOptional = customerService.getCustomerById(id);

    if (customerOptional.isPresent()) {
        Customer customer = customerOptional.get();
        List<CustomerAddress> addresses = customer.getCustomerAddress();

        if (addresses == null || addresses.isEmpty()) {
            return ResponseEntity.badRequest().build(); // nothing to delete
        }

        boolean removed = addresses.removeIf(addr ->
                addr.getAddressId() != null && addr.getAddressId().equals(addressId));

        if (!removed) {
            return ResponseEntity.notFound().build(); // addressId not found
        }

        customer.setCustomerAddress(addresses);
        customerService.saveCustomer(customer);

        return ResponseEntity.ok(customer);
    }

    return ResponseEntity.notFound().build();
}


}

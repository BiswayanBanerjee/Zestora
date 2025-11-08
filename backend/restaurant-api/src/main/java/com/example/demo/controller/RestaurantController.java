package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import com.example.demo.model.Restaurant;
import com.example.demo.model.Dish;
import com.example.demo.service.RestaurantService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    // Get all restaurants
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    // Get restaurant by ID
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable String id) {
        return restaurantService.getRestaurantById(id);
    }

    // Create a new restaurant
    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.addRestaurant(restaurant);
    }

    // Update an existing restaurant
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable String id, @RequestBody Restaurant restaurantDetails) {
        Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, restaurantDetails);
        if (updatedRestaurant != null) {
            return ResponseEntity.ok(updatedRestaurant);
        } else {
            return ResponseEntity.notFound().build();  // Restaurant not found
        }
    }

    // Delete a restaurant by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    // API to find nearby restaurants
    @GetMapping("/nearby")
    public List<Restaurant> getNearbyRestaurants(@RequestParam double longitude, @RequestParam double latitude, @RequestParam double radius) {
        return restaurantService.findNearbyRestaurants(longitude, latitude, radius);
    }

    // ================== IMAGE HANDLING ENDPOINTS ==================

    // // Upload restaurant image
    // @PostMapping("/{id}/upload-image")
    // public ResponseEntity<String> uploadRestaurantImage(@PathVariable String id, @RequestParam("image") MultipartFile imageFile) {
    //     try {
    //         String imageUrl = restaurantService.uploadRestaurantImage(id, imageFile);
    //         if (imageUrl != null) {
    //             return ResponseEntity.ok(imageUrl);
    //         } else {
    //             return ResponseEntity.notFound().build();  // Restaurant not found
    //         }
    //     } catch (IOException e) {
    //         return ResponseEntity.status(500).body("Error uploading image: " + e.getMessage());
    //     }
    // }

    // // Update restaurant image
    // @PutMapping("/{id}/update-image")
    // public ResponseEntity<String> updateRestaurantImage(@PathVariable String id, @RequestParam("image") MultipartFile imageFile) {
    //     try {
    //         String updatedImageUrl = restaurantService.updateRestaurantImage(id, imageFile);
    //         if (updatedImageUrl != null) {
    //             return ResponseEntity.ok(updatedImageUrl);
    //         } else {
    //             return ResponseEntity.notFound().build();  // Restaurant not found
    //         }
    //     } catch (IOException e) {
    //         return ResponseEntity.status(500).body("Error updating image: " + e.getMessage());
    //     }
    // }

    // // Delete restaurant image
    // @DeleteMapping("/{id}/delete-image")
    // public ResponseEntity<Void> deleteRestaurantImage(@PathVariable String id) {
    //     try {
    //         restaurantService.deleteRestaurantImage(id);
    //         return ResponseEntity.noContent().build();
    //     } catch (IOException e) {
    //         return ResponseEntity.status(500).build();  // Error deleting image
    //     }
    // }

 // Upload restaurant image
@PostMapping("/{id}/upload-image")
public ResponseEntity<String> uploadRestaurantImage(@PathVariable String id, @RequestBody String imageUrl) {
    try {
        String uploadedImageUrl = restaurantService.uploadRestaurantImage(id, imageUrl);
        if (uploadedImageUrl != null) {
            return ResponseEntity.ok(uploadedImageUrl);
        } else {
            return ResponseEntity.notFound().build();  // Restaurant not found
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error uploading image: " + e.getMessage());
    }
}

// Update restaurant image
@PutMapping("/{id}/update-image")
public ResponseEntity<String> updateRestaurantImage(@PathVariable String id, @RequestBody String imageUrl) {
    try {
        String updatedImageUrl = restaurantService.updateRestaurantImage(id, imageUrl);
        if (updatedImageUrl != null) {
            return ResponseEntity.ok(updatedImageUrl);
        } else {
            return ResponseEntity.notFound().build();  // Restaurant not found
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error updating image: " + e.getMessage());
    }
}


// Delete restaurant image
@DeleteMapping("/{id}/delete-image")
public ResponseEntity<Void> deleteRestaurantImage(@PathVariable String id) {
    try {
        restaurantService.deleteRestaurantImage(id);
        return ResponseEntity.noContent().build();
    } catch (Exception e) {
        return ResponseEntity.status(500).build();  // Error deleting image
    }
}


    // ================== DISH HANDLING ENDPOINTS ==================

    // Get all dishes across all restaurants
    @GetMapping("/dishes")
    public ResponseEntity<List<Dish>> getAllDishes() {
        List<Dish> dishes = restaurantService.getAllDishes();
        if (dishes != null && !dishes.isEmpty()) {
            return ResponseEntity.ok(dishes);
        } else {
            return ResponseEntity.noContent().build();  // No dishes found
        }
    }

    // Add a new dish to a restaurant
    @PostMapping("/{restaurantId}/dishes")
    public ResponseEntity<Restaurant> addDish(@PathVariable String restaurantId, @RequestBody Dish dish) {
        Restaurant updatedRestaurant = restaurantService.addDishToRestaurant(restaurantId, dish);
        if (updatedRestaurant != null) {
            return ResponseEntity.ok(updatedRestaurant);
        } else {
            return ResponseEntity.notFound().build();  // Restaurant not found
        }
    }

    // Update a dish in a restaurant
    @PutMapping("/{restaurantId}/dishes/{dishId}")
    public ResponseEntity<Restaurant> updateDish(@PathVariable String restaurantId, @PathVariable String dishId, @RequestBody Dish dishDetails) {
        Restaurant updatedRestaurant = restaurantService.updateDishInRestaurant(restaurantId, dishId, dishDetails);
        if (updatedRestaurant != null) {
            return ResponseEntity.ok(updatedRestaurant);
        } else {
            return ResponseEntity.notFound().build();  // Restaurant or Dish not found
        }
    }

    // Remove a dish from a restaurant
    @DeleteMapping("/{restaurantId}/dishes/{dishId}")
    public ResponseEntity<Restaurant> removeDish(@PathVariable String restaurantId, @PathVariable String dishId) {
        Restaurant updatedRestaurant = restaurantService.removeDishFromRestaurant(restaurantId, dishId);
        if (updatedRestaurant != null) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();  // Restaurant or Dish not found
        }
    }

    // ================== DISH IMAGE HANDLING ENDPOINTS ==================

    // // Upload dish image
    // @PostMapping("/{restaurantId}/dishes/{dishId}/upload-image")
    // public ResponseEntity<String> uploadDishImage(@PathVariable String restaurantId, @PathVariable String dishId, @RequestParam("image") MultipartFile imageFile) {
    //     try {
    //         String imageUrl = restaurantService.uploadDishImage(restaurantId, dishId, imageFile);
    //         if (imageUrl != null) {
    //             return ResponseEntity.ok(imageUrl);
    //         } else {
    //             return ResponseEntity.notFound().build();  // Restaurant or Dish not found
    //         }
    //     } catch (IOException e) {
    //         return ResponseEntity.status(500).body("Error uploading dish image: " + e.getMessage());
    //     }
    // }

    // // Update dish image
    // @PutMapping("/{restaurantId}/dishes/{dishId}/update-image")
    // public ResponseEntity<String> updateDishImage(@PathVariable String restaurantId, @PathVariable String dishId, @RequestParam("image") MultipartFile imageFile) {
    //     try {
    //         String updatedImageUrl = restaurantService.updateDishImage(restaurantId, dishId, imageFile);
    //         if (updatedImageUrl != null) {
    //             return ResponseEntity.ok(updatedImageUrl);
    //         } else {
    //             return ResponseEntity.notFound().build();  // Restaurant or Dish not found
    //         }
    //     } catch (IOException e) {
    //         return ResponseEntity.status(500).body("Error updating dish image: " + e.getMessage());
    //     }
    // }

    // // Delete dish image
    // @DeleteMapping("/{restaurantId}/dishes/{dishId}/delete-image")
    // public ResponseEntity<Void> deleteDishImage(@PathVariable String restaurantId, @PathVariable String dishId) {
    //     try {
    //         restaurantService.deleteDishImage(restaurantId, dishId);
    //         return ResponseEntity.noContent().build();
    //     } catch (IOException e) {
    //         return ResponseEntity.status(500).build();  // Error deleting dish image
    //     }
    // }

   // Upload dish image
@PostMapping("/{restaurantId}/dishes/{dishId}/upload-image")
public ResponseEntity<String> uploadDishImage(@PathVariable String restaurantId, @PathVariable String dishId, 
                                              @RequestBody String imageUrl) {
    try {
        String uploadedImageUrl = restaurantService.uploadDishImage(restaurantId, dishId, imageUrl);
        if (uploadedImageUrl != null) {
            return ResponseEntity.ok(uploadedImageUrl);
        } else {
            return ResponseEntity.notFound().build();  // Restaurant or Dish not found
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error uploading dish image: " + e.getMessage());
    }
}

// Update dish image
@PutMapping("/{restaurantId}/dishes/{dishId}/update-image")
public ResponseEntity<String> updateDishImage(@PathVariable String restaurantId, @PathVariable String dishId, 
                                              @RequestBody String imageUrl) {
    try {
        String updatedImageUrl = restaurantService.updateDishImage(restaurantId, dishId, imageUrl);
        if (updatedImageUrl != null) {
            return ResponseEntity.ok(updatedImageUrl);
        } else {
            return ResponseEntity.notFound().build();  // Restaurant or Dish not found
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error updating dish image: " + e.getMessage());
    }
}

// Delete dish image
@DeleteMapping("/{restaurantId}/dishes/{dishId}/delete-image")
public ResponseEntity<Void> deleteDishImage(@PathVariable String restaurantId, @PathVariable String dishId) {
    try {
        restaurantService.deleteDishImage(restaurantId, dishId);
        return ResponseEntity.noContent().build();
    } catch (Exception e) {
        return ResponseEntity.status(500).build();  // Error deleting dish image
    }
}
// Endpoint to update all dish images for a restaurant
@PutMapping("/{id}/update-all-dish-images")
public ResponseEntity<Void> updateAllDishImages(@PathVariable String id) {
    try {
        restaurantService.updateAllDishImages(id);
        return ResponseEntity.noContent().build();
    } catch (Exception e) {
        return ResponseEntity.status(500).build();  // Error updating dish images
    }
}

// Update restaurant approval status
@PatchMapping("/{id}/approval")
public ResponseEntity<Void> updateRestaurantApproval(@PathVariable String id, @RequestParam boolean isApproved) {
    try {
        restaurantService.updateRestaurantApproval(id, isApproved);
        return ResponseEntity.noContent().build();
    } catch (Exception e) {
        return ResponseEntity.status(500).build();  // Error updating approval status
    }
}

// Update restaurant availability status
@PatchMapping("/{id}/availability")
public ResponseEntity<Void> updateRestaurantAvailability(@PathVariable String id, @RequestParam boolean isAvailable) {
    try {
        restaurantService.updateRestaurantAvailability(id, isAvailable);
        return ResponseEntity.noContent().build();
    } catch (Exception e) {
        return ResponseEntity.status(500).build();  // Error updating availability status
    }
}
// // Fetch restaurant availability status
// @GetMapping("/{id}/availability")
// public ResponseEntity<Boolean> getRestaurantAvailability(@PathVariable String id) {
//     Restaurant restaurant = restaurantService.getRestaurantById(id);
//     if (restaurant != null) {
//         return ResponseEntity.ok(restaurant.isAvailable());
//     }
//     return ResponseEntity.notFound().build();
// }

// // Fetch restaurant approval status
// @GetMapping("/{id}/approval")
// public ResponseEntity<Boolean> getRestaurantApproval(@PathVariable String id) {
//     Restaurant restaurant = restaurantService.getRestaurantById(id);
//     if (restaurant != null) {
//         return ResponseEntity.ok(restaurant.isApproved());
//     }
//     return ResponseEntity.notFound().build();
// }

// Fetch restaurant availability status
@GetMapping("/availability")
public ResponseEntity<Map<String, Boolean>> getRestaurantAvailability(@RequestParam List<String> ids) {
    Map<String, Boolean> availabilityMap = new HashMap<>();
    for (String id : ids) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        if (restaurant != null) {
            availabilityMap.put(id, restaurant.isAvailable());
        } else {
            availabilityMap.put(id, null);  // or handle not found case as needed
        }
    }
    return ResponseEntity.ok(availabilityMap);
}

// Fetch restaurant approval status
@GetMapping("/approval")
public ResponseEntity<Map<String, Boolean>> getRestaurantApproval(@RequestParam List<String> ids) {
    Map<String, Boolean> approvalMap = new HashMap<>();
    for (String id : ids) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        if (restaurant != null) {
            approvalMap.put(id, restaurant.isApproved());
        } else {
            approvalMap.put(id, null);  // or handle not found case as needed
        }
    }
    return ResponseEntity.ok(approvalMap);
}

// Fetch restaurant availability and approval statuses
@GetMapping("/statuses")
public ResponseEntity<Map<String, Map<String, Boolean>>> getRestaurantStatuses(@RequestParam List<String> ids) {
    Map<String, Map<String, Boolean>> statusesMap = new HashMap<>();
    for (String id : ids) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        Map<String, Boolean> status = new HashMap<>();
        if (restaurant != null) {
            status.put("isAvailable", restaurant.isAvailable());
            status.put("isApproved", restaurant.isApproved());
        } else {
            status.put("isAvailable", null);
            status.put("isApproved", null);
        }
        statusesMap.put(id, status);
    }
    return ResponseEntity.ok(statusesMap);
}

private final String orsApiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ0NTZhOGNjNDdjZDRlNWY5ZTAxYTVlMGM2YzM0OGY3IiwiaCI6Im11cm11cjY0In0";

    @GetMapping("/eta")
    public ResponseEntity<?> getETA(
            @RequestParam String start,
            @RequestParam String end) {

        try {
            String url = "https://api.openrouteservice.org/v2/directions/driving-car"
                    + "?api_key=" + orsApiKey
                    + "&start=" + start
                    + "&end=" + end;

            RestTemplate restTemplate = new RestTemplate();
            
            Object response = restTemplate.getForObject(url, Object.class);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching ETA: " + e.getMessage());
        }
    }


}

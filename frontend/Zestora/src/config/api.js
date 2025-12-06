import axios from 'axios';

// Use Vite env variables instead of process.env
const RESTAURANT = import.meta.env.VITE_RESTAURANT_API_BASE_URL;
const CUSTOMER = import.meta.env.VITE_CUSTOMER_API_BASE_URL;

export const getRestaurants = () => {
  return axios.get(`${RESTAURANT}/restaurants`);
};

export const updateDish = (restaurantId, dishId, data) => {
  return axios.put(
    `${RESTAURANT}/restaurants/${restaurantId}/dishes/${dishId}`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

export const fetchStatuses = (restaurantIds) => {
  return axios.get(`${RESTAURANT}/restaurants/statuses?ids=${restaurantIds}`);
};

export const deleteRestaurant = (restaurantId) => {
  return axios.delete(`${RESTAURANT}/restaurants/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const toggleRestaurantApproval = (restaurantId, isApproved) => {
  return axios.patch(
    `${RESTAURANT}/restaurants/${restaurantId}/approval?isApproved=${isApproved}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

export const toggleRestaurantAvailability = (restaurantId, isAvailable) => {
  return axios.patch(
    `${RESTAURANT}/restaurants/${restaurantId}/availability?isAvailable=${isAvailable}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

export const CartCount = (userEmail) => {
  return axios.get(`${CUSTOMER}/customers/${userEmail}/cart`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

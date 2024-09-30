// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  getPosts() {
    return apiClient.get('/posts');
  },
  getPost(id) {
    return apiClient.get(`/posts/${id}`);
  },
  getUsers() {
    return apiClient.get('/users');
  },
  getUser(id) {
    return apiClient.get(`/users/${id}`);
  },
  // Add other API calls as needed
};

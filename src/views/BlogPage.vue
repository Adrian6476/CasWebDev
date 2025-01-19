<!-- src/views/BlogPage.vue -->
<template>
    <v-container>
      <h1 class="text-h3 mb-5">Our Blog</h1>
      <v-row v-if="isLoading">
        <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
          <v-skeleton-loader
            type="card"
            class="mx-auto"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-else-if="posts.length">
        <v-col v-for="post in paginatedPosts" :key="post.id" cols="12" sm="6" md="4">
          <v-card class="mx-auto" height="100%">
            <v-img
              :src="`https://picsum.photos/seed/${post.id}/400/200`"
              height="200px"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            >
              <v-card-title v-text="post.title"></v-card-title>
            </v-img>
            <v-card-text>
              <v-row align="center" class="mx-0 mb-2">
                <v-icon small class="mr-1">mdi-account</v-icon>
                <span class="subheading mr-2">User {{ post.userId }}</span>
                <v-icon small class="mr-1">mdi-clock</v-icon>
                <span class="subheading">{{ formatDate(post.id) }}</span>
              </v-row>
              <div class="mb-2">{{ truncateBody(post.body) }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" text :to="{ name: 'BlogDetails', params: { id: post.id } }">
                Read More
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="toggleFavorite(post)">
                <v-icon :color="post.favorite ? 'red' : ''">
                  {{ post.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else justify="center" align="center" style="height: 300px;">
        <v-col cols="12" class="text-center">
          <h2 class="text-h5">No blog posts found.</h2>
        </v-col>
      </v-row>
      <v-pagination
        v-if="posts.length"
        v-model="currentPage"
        :length="pageCount"
        :total-visible="7"
        circle
      ></v-pagination>
    </v-container>
  </template>
  
  <script>
  import api from '@/services/api.js';
  
  export default {
    name: 'BlogPage',
    data() {
      return {
        posts: [],
        isLoading: true,
        errorMessage: '',
        currentPage: 1,
        postsPerPage: 6,
      };
    },
    computed: {
      pageCount() {
        return Math.ceil(this.posts.length / this.postsPerPage);
      },
      paginatedPosts() {
        const start = (this.currentPage - 1) * this.postsPerPage;
        const end = start + this.postsPerPage;
        return this.posts.slice(start, end);
      },
    },
    methods: {
      fetchPosts() {
        this.isLoading = true;
        api.getPosts()
          .then((response) => {
            this.posts = response.data.map(post => ({
              ...post,
              favorite: false
            }));
          })
          .catch((error) => {
            this.errorMessage = 'Failed to load blog posts.';
            console.error(error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
      truncateBody(text) {
        return text.length > 100 ? text.slice(0, 100) + '...' : text;
      },
      formatDate(id) {
        // This is a mock date based on the post ID
        const date = new Date(2023, 0, id);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      },
      toggleFavorite(post) {
        post.favorite = !post.favorite;
      },
    },
    created() {
      this.fetchPosts();
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    display: flex;
    flex-direction: column;
  }
  .v-card__text {
    flex-grow: 1;
  }
  </style>
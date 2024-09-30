<!-- src/components/blog/BlogDetails.vue -->
<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-img
              :src="imageSrc"
              height="400px"
            ></v-img>
            <v-card-title class="headline">{{ post.title }}</v-card-title>
            <v-card-text>
              <p>{{ post.body }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <RecommendedPosts :excludeId="post.id" />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import RecommendedPosts from './RecommendedPosts.vue';
  import api from '@/services/api.js';
  
  export default {
    name: 'BlogDetails',
    components: {
      RecommendedPosts,
    },
    data() {
      return {
        post: {},
        isLoading: false,
        errorMessage: '',
        imageSrc: 'https://via.placeholder.com/800x400?text=Blog+Image',
      };
    },
    methods: {
      fetchPost() {
        this.isLoading = true;
        const postId = this.$route.params.id;
        api.getPost(postId)
          .then((response) => {
            this.post = response.data;
          })
          .catch((error) => {
            this.errorMessage = 'Failed to load the blog post.';
            console.error(error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    },
    watch: {
      '$route.params.id': 'fetchPost',
    },
    created() {
      this.fetchPost();
    },
  };
  </script>
  
  <style scoped>
  /* Add any specific styles for the BlogDetails component */
  </style>
  
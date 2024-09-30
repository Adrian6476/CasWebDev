<!-- src/components/blog/BlogList.vue -->
<template>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
          lg="4"
          v-for="(post, index) in posts"
          :key="index"
        >
          <BlogCard :post="post" />
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import BlogCard from './BlogCard.vue';
import api from '@/services/api.js';

export default {
name: 'BlogList',
components: {
    BlogCard,
},
data() {
    return {
    posts: [],
    isLoading: false,
    errorMessage: '',
    };
},
methods: {
    fetchPosts() {
    this.isLoading = true;
    api.getPosts()
        .then((response) => {
        this.posts = response.data;
        })
        .catch((error) => {
        this.errorMessage = 'Failed to load blog posts.';
        console.error(error);
        })
        .finally(() => {
        this.isLoading = false;
        });
    },
},
created() {
    this.fetchPosts();
},
};
</script>

<style scoped>
/* Add any specific styles for the BlogList component */
</style>

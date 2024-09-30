<!-- src/components/blog/RecommendedPosts.vue -->
<template>
    <div>
      <h3>Recommended Posts</h3>
      <v-list dense>
        <v-list-item
          v-for="(post, index) in recommendedPosts"
          :key="index"
          :to="{ name: 'BlogDetails', params: { id: post.id } }"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ post.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
</template>

<script>
import api from '@/services/api.js';

export default {
name: 'RecommendedPosts',
props: {
    excludeId: {
    type: Number,
    default: null,
    },
},
data() {
    return {
    recommendedPosts: [],
    };
},
methods: {
    fetchRecommendedPosts() {
    api.getPosts()
        .then((response) => {
        this.recommendedPosts = response.data
            .filter((post) => post.id !== this.excludeId)
            .slice(0, 5);
        })
        .catch((error) => {
        console.error('Failed to load recommended posts:', error);
        });
    },
},
created() {
    this.fetchRecommendedPosts();
},
};
</script>

<style scoped>
/* Add any specific styles for the RecommendedPosts component */
</style>

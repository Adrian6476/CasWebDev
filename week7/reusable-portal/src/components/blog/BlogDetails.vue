<!-- src/components/blog/BlogDetails.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card v-if="post">
          <v-card-title>{{ post.title }}</v-card-title>
          <v-card-text>
            <p>{{ post.body }}</p>
          </v-card-text>
        </v-card>
        <v-skeleton-loader
          v-else
          type="article"
          class="mx-auto"
        ></v-skeleton-loader>
    </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <RecommendedPosts :excludeId="Number(id)" />
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
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      post: null,
    };
  },
  methods: {
    fetchPost() {
      api.getPost(this.id)
        .then((response) => {
          this.post = response.data;
        })
        .catch((error) => {
          console.error('Failed to load the blog post:', error);
        });
    },
  },
  created() {
    this.fetchPost();
  },
};
</script>
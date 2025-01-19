<!-- src/views/BlogDetailsPage.vue -->
<template>
  <v-container>
    <v-btn class="mb-5" text @click="$router.go(-1)">
      <v-icon left>mdi-arrow-left</v-icon>
      Back to Blog
    </v-btn>

    <v-row>
      <v-col cols="12" md="8">
        <v-card v-if="post" class="mb-4">
          <v-img
            :src="`https://picsum.photos/seed/${post.id}/1200/800`"
            height="400"
            class="grey lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-title class="text-h4 pt-4">{{ post.title }}</v-card-title>
          <v-card-subtitle>
            <v-row align="center" class="mx-0">
              <v-avatar size="36" class="mr-2">
                <v-img :src="`https://i.pravatar.cc/150?u=${post.userId}`"></v-img>
              </v-avatar>
              <span class="subheading mr-2">User {{ post.userId }}</span>
              <v-icon small class="mr-1">mdi-clock</v-icon>
              <span class="subheading">{{ formatDate(post.id) }}</span>
            </v-row>
          </v-card-subtitle>
          <v-card-text class="text-body-1 post-content">
            <p>{{ post.body }}</p>
          </v-card-text>
        </v-card>
        <v-skeleton-loader
          v-else
          type="article, paragraph, paragraph"
          class="mx-auto"
        ></v-skeleton-loader>

        <!-- Comments Section -->
        <v-card class="mb-4" v-if="comments.length">
          <v-card-title class="text-h5">Comments</v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="(comment, index) in comments"
              :key="index"
              class="comment-item"
            >
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ comment.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="grey--text">
                  {{ comment.email }}
                </v-list-item-subtitle>
                <v-list-item-text>
                  {{ comment.body }}
                </v-list-item-text>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
        <v-skeleton-loader
          v-else
          type="list-item, list-item, list-item"
          class="mx-auto"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="4">
        <RecommendedPosts :excludeId="Number($route.params.id)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecommendedPosts from '@/components/blog/RecommendedPosts.vue';
import api from '@/services/api.js';

export default {
  name: 'BlogDetailsPage',
  components: {
    RecommendedPosts,
  },
  data() {
    return {
      post: null,
      comments: [],
    };
  },
  methods: {
    fetchPost() {
      const id = this.$route.params.id;
      api.getPost(id)
        .then((response) => {
          this.post = response.data;
        })
        .catch((error) => {
          console.error('Failed to load the blog post:', error);
        });
    },
    fetchComments() {
      const id = this.$route.params.id;
      api.getComments(id)
        .then((response) => {
          this.comments = response.data;
        })
        .catch((error) => {
          console.error('Failed to load comments:', error);
        });
    },
    formatDate(id) {
      const date = new Date(2023, 0, id);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
  },
  created() {
    this.fetchPost();
    this.fetchComments();
  },
};
</script>

<style scoped>
.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
}
.post-content p {
  margin-bottom: 1rem;
}
.comment-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

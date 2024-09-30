<!-- src/components/blog/BlogCard.vue -->
<template>
    <v-card class="blog-card">
      <v-img
        :src="imageSrc"
        height="200px"
      ></v-img>
      <v-card-title>{{ post.title }}</v-card-title>
      <v-card-text>
        <div class="truncate-text">{{ post.body }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text :to="{ name: 'BlogDetails', params: { id: post.id } }">
          Read More
        </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
export default {
name: 'BlogCard',
props: {
    post: {
    type: Object,
    required: true,
    },
    imageSrc: {
    type: String,
    default: 'https://via.placeholder.com/400x200?text=Blog+Image',
    },
},
};
</script>

<style scoped>
.blog-card {
margin-bottom: 20px;
}

.truncate-text {
display: -webkit-box;
-webkit-line-clamp: 3; /* Limit to 3 lines */
-webkit-box-orient: vertical;
overflow: hidden;
}
</style>

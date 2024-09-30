<!-- src/components/core/AppFooter.vue -->
<template>
    <v-footer color="primary" app>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" sm="6">
            <span class="white--text">&copy; {{ new Date().getFullYear() }} Company Name</span>
          </v-col>
          <v-col cols="12" sm="6" class="text-sm-right">
            <v-btn text class="white--text" href="#">Privacy Policy</v-btn>
            <v-btn text class="white--text" href="#">Terms of Service</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
</template>

<script>
export default {
name: 'AppFooter',
};
</script>

<style scoped>
.v-footer {
padding-top: 20px;
padding-bottom: 20px;
}
</style>

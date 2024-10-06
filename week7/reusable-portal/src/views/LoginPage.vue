<!-- src/views/LoginPage.vue -->
<template>
  <v-container>
    <h1>Login</h1>
    <v-form ref="loginForm" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="[rules.required, rules.email]"
        label="Email"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="[rules.required]"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        required
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-btn :disabled="!valid || isLoading" color="primary" @click="login" class="mr-4">
        Login
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="white"
          size="24"
          class="ml-2"
        ></v-progress-circular>
      </v-btn>
    </v-form>
    <p>
      Don't have an account?
      <router-link to="/register">Register here</router-link>.
    </p>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const valid = ref(false);
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);
    const router = useRouter();
    const rules = {
      required: (value) => !!value || 'Required.',
      email: (value) => {
        const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
    };

    const login = async () => {
      if (valid.value) {
        isLoading.value = true;
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          alert('Logged in successfully!');
          router.push('/');
        } catch (error) {
          alert(error.message);
        } finally {
          isLoading.value = false;
        }
      }
    };

    return {
      valid,
      email,
      password,
      isLoading,
      showPassword,
      rules,
      login,
    };
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
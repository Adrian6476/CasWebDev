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
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="primary" @click="login">
        Login
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
  const router = useRouter();
  const rules = {
    required: (value) => !!value || 'Required.',
    email: (value) => {
      const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
      return pattern.test(value) || 'Invalid e-mail.';
    },
  };

  const login = () => {
    if (valid.value) {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          alert('Logged in successfully!');
          // Redirect to home or desired page
          router.push('/');
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return {
    valid,
    email,
    password,
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
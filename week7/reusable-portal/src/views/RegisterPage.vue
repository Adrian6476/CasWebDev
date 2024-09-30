<!-- src/views/RegisterPage.vue -->
<template>
  <v-container>
    <h1>Register</h1>
    <v-form ref="registerForm" v-model="valid" lazy-validation>
      <v-text-field
        v-model="name"
        :rules="[rules.required]"
        label="Full Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="[rules.required, rules.email]"
        label="Email"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="[rules.required, rules.min]"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="primary" @click="register">
        Register
      </v-btn>
    </v-form>
    <p>
      Already have an account?
      <router-link to="/login">Login here</router-link>.
    </p>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default {
  name: 'RegisterPage',
  setup() {
    const valid = ref(false);
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const rules = {
      required: (value) => !!value || 'Required.',
      email: (value) => {
        const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
      min: (value) => (value && value.length >= 6) || 'Min 6 characters',
    };

    const register = async () => {
      if (valid.value) {
        try {
          console.log('Attempting to create user with email:', email.value);
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
          const user = userCredential.user;
          
          console.log('User created successfully:', user.uid);
          
          // Save user profile to Firestore
          await setDoc(doc(db, 'users', user.uid), {
            name: name.value,
            email: email.value,
          });
          
          console.log('User profile saved to Firestore');
          alert('Registered successfully!');
          router.push('/');
        } catch (error) {
          console.error('Registration error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          alert(`An error occurred during registration: ${error.message}`);
        }
      }
    };

    return {
      valid,
      name,
      email,
      password,
      rules,
      register,
    };
  },
};
</script>
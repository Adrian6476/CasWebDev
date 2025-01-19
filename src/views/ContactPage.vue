<!-- src/views/ContactPage.vue -->
<template>
    <v-container>
      <h1>Contact Us</h1>
      <p>If you have any questions or inquiries, please reach out to us using the form below.</p>
      
      <v-form ref="contactForm" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :rules="[rules.required]"
          label="Name"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          label="Email"
          required
        ></v-text-field>
  
        <v-textarea
          v-model="message"
          :rules="[rules.required]"
          label="Message"
          required
        ></v-textarea>
  
        <v-btn :disabled="!valid" color="primary" @click="submit">
          Submit
        </v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'ContactPage',
    data() {
      return {
        valid: false,
        name: '',
        email: '',
        message: '',
        rules: {
          required: (value) => !!value || 'Required.',
          email: (value) => {
            const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
            return pattern.test(value) || 'Invalid e-mail.';
          },
        },
      };
    },
    methods: {
      submit() {
        if (this.$refs.contactForm.validate()) {
          // Handle form submission (e.g., send data to an API)
          alert('Your message has been sent!');
          // Reset form fields
          this.name = '';
          this.email = '';
          this.message = '';
          this.$refs.contactForm.reset();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    margin-bottom: 20px;
  }
  
  .v-form {
    max-width: 600px;
  }
  </style>
  
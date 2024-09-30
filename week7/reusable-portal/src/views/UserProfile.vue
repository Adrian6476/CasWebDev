<!-- src/views/UserProfile.vue -->
<template>
    <v-container>
      <h1>User Profile</h1>
      <v-form ref="profileForm" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :rules="[rules.required]"
          label="Full Name"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="email"
          label="Email"
          disabled
        ></v-text-field>
  
        <v-btn :disabled="!valid" color="primary" @click="updateProfile">
          Save Changes
        </v-btn>
      </v-form>
    </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default {
  name: 'UserProfile',
  setup() {
    const valid = ref(false);
    const name = ref('');
    const email = ref('');
    const rules = {
      required: (value) => !!value || 'Required.',
    };

    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        email.value = user.email;
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          name.value = docSnap.data().name;
        } else {
          console.log('No such document!');
        }
      }
    };

    const updateProfile = async () => {
      if (valid.value) {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          await updateDoc(docRef, {
            name: name.value,
          });
          alert('Profile updated successfully!');
        }
      }
    };

    onMounted(() => {
      fetchUserProfile();
    });

    return {
      valid,
      name,
      email,
      rules,
      updateProfile,
    };
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
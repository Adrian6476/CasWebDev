<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="mx-auto pa-6">
          <div class="d-flex flex-column align-center mb-6">
            <div class="avatar-container">
              <v-avatar size="128" class="mb-4 avatar-hover" @click="$refs.fileInput.click()">
                <v-img
                  :src="authStore.currentUser?.photoURL || 'https://ui-avatars.com/api/?name=' + (authStore.currentUser?.name || authStore.currentUser?.displayName || authStore.currentUser?.email)"
                  alt="Profile"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <div class="avatar-overlay">
                  <v-icon size="20" color="white">mdi-camera</v-icon>
                </div>
              </v-avatar>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarChange"
              >
            </div>
          </div>

          <v-form ref="form" v-model="isValid" @submit.prevent="saveProfile">
            <v-text-field
              v-model="profile.displayName"
              :label="$t('profile.displayName')"
              :rules="[v => !!v || $t('profile.displayNameRequired')]"
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              :model-value="authStore.currentUser?.email || ''"
              :label="$t('auth.email')"
              disabled
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="profile.phone"
              :label="$t('profile.phone')"
              :rules="[
                v => !!v || $t('profile.phoneRequired'),
                v => /^\+?\d{1,4}?\d{7,15}$/.test(v) || $t('profile.phoneValid')
              ]"
              variant="outlined"
              class="mb-4"
              clearable
            ></v-text-field>

            <v-textarea
              v-model="profile.bio"
              :label="$t('profile.bio')"
              :rules="[v => (v || '').length <= 500 || $t('profile.bioLength')]"
              variant="outlined"
              auto-grow
              rows="3"
              class="mb-4"
              counter="500"
            ></v-textarea>

            <div class="d-flex justify-end">
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                :disabled="!isValid"
              >
                {{ $t('common.save') }}
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- 通知提示 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'
import { updateProfile } from 'firebase/auth'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase'

const { t } = useI18n()
const authStore = useAuthStore()
const form = ref(null)
const isValid = ref(false)
const loading = ref(false)
const avatarFile = ref(null)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const profile = ref({
  displayName: '',
  phone: '',
  bio: ''
})

const showNotification = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

const handleAvatarChange = async (file) => {
  if (!file) return

  try {
    loading.value = true
    const avatarRef = storageRef(storage, `avatars/${authStore.currentUser.uid}`)
    await uploadBytes(avatarRef, file)
    const photoURL = await getDownloadURL(avatarRef)
    
    await updateProfile(authStore.currentUser, {
      photoURL
    })
    
    showNotification(t('profile.avatarUpdated'))
  } catch (error) {
    console.error('Error uploading avatar:', error)
    showNotification(t('profile.avatarError'), 'error')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  if (!form.value.validate()) return

  loading.value = true
  try {
    // 保存核心资料并等待结果
    await authStore.updateUserProfile(authStore.currentUser.uid, {
      name: profile.value.displayName,
      phone: profile.value.phone,
      bio: profile.value.bio
    })
    
    // 重新加载最新数据确保一致性
    await authStore.loadUserProfile(authStore.currentUser.uid)
    
    showNotification(t('profile.saved'))
    
    // 异步处理显示名称更新（静默失败）
    if (profile.value.displayName !== authStore.userProfile?.name) {
      updateProfile(authStore.currentUser, {
        displayName: profile.value.displayName
      }).then(() => {
        console.log('显示名称更新成功')
        authStore.userProfile.name = profile.value.displayName
      }).catch(updateError => {
        console.debug('显示名称更新非关键错误:', updateError)
      })
    }
  } catch (error) {
    console.error('资料保存失败:', error)
    showNotification(
      error.code ? t(`errors.${error.code}`) : t('profile.error'), 
      'error'
    )
  } finally {
    loading.value = false
  }
}

// 监听用户配置文件变化
watch(() => authStore.currentUser, async (user) => {
  if (user) {
    // 确保用户配置文件已加载
    if (!authStore.userProfile) {
      await authStore.loadUserProfile(user.uid)
    }
    profile.value = {
      displayName: authStore.userProfile?.name || '',
      phone: authStore.userProfile?.phone || '',
      bio: authStore.userProfile?.bio || ''
    }
  }
}, { immediate: true })
</script>

<style scoped>
.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar-hover:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 6px; /* Reduced padding */
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.1); /* Reduced shadow opacity */
}

.change-text {
  font-size: 16px; /* Increased font size */
  font-weight: bold; /* Made text bold for emphasis */
  text-transform: uppercase;
}
</style>

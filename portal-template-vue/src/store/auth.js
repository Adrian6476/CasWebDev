import { defineStore } from 'pinia'
import { auth, db } from '@/firebase'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useI18n } from 'vue-i18n'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,
    error: null
  }),

  actions: {
    async loadUserProfile(uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
          this.userProfile = userDoc.data()
        } else {
          // 创建新的用户配置文件
          const newProfile = {
            name: "Adrian Wang", // 默认使用此名称
            phone: '',
            bio: '',
            createdAt: new Date().toISOString()
          }
          await setDoc(doc(db, 'users', uid), newProfile)
          this.userProfile = newProfile
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
        this.error = error.message
      }
    },

    async updateUserProfile(uid, data) {
      try {
        await updateDoc(doc(db, 'users', uid), data)
        this.userProfile = { ...this.userProfile, ...data }
      } catch (error) {
        console.error('Error updating user profile:', error)
        throw error
      }
    },

    async register({ email, password }) {
      this.loading = true
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        await this.loadUserProfile(userCredential.user.uid)
        this.error = null
        return { success: true, message: useI18n().t('auth.accountCreated') }
      } catch (error) {
        const { t } = useI18n()
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.error = t('auth.emailInUse')
            break
          case 'auth/invalid-email':
            this.error = t('contact.form.emailValid')
            break
          case 'auth/weak-password':
            this.error = t('auth.passwordRequirements')
            break
          default:
            this.error = error.message
        }
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async login({ email, password, rememberMe = false }) {
      this.loading = true
      try {
        await setPersistence(auth, 
          rememberMe ? browserLocalPersistence : browserSessionPersistence
        )
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        await this.loadUserProfile(userCredential.user.uid)
        this.error = null
        return { success: true }
      } catch (error) {
        const { t } = useI18n()
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-disabled':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.error = t('auth.invalidCredentials')
            break
          default:
            this.error = error.message
        }
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await signOut(auth)
        this.user = null
        this.userProfile = null
        this.error = null
        return { success: true, message: useI18n().t('auth.logoutSuccess') }
      } catch (error) {
        this.error = error.message
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    initializeAuthListener() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user
          await this.loadUserProfile(user.uid)
        } else {
          this.user = null
          this.userProfile = null
        }
      })
    },

    clearError() {
      this.error = null
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => ({
      ...state.user,
      name: state.userProfile?.name
    }),
    hasError: (state) => !!state.error,
    authError: (state) => state.error
  }
})

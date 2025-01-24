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

    async register({ username, email, password }, t) {
      if (this.loading) return
      this.loading = true
      this.error = null
      
      try {
        // 1. 创建认证用户
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        try {
          // 2. 创建用户配置文件
          const newProfile = {
            name: username,
            phone: '',
            bio: '',
            createdAt: new Date().toISOString()
          }
          await setDoc(doc(db, 'users', userCredential.user.uid), newProfile)
          
          // 3. 更新状态
          this.user = userCredential.user
          this.userProfile = newProfile
          
          return { success: true, message: t('auth.accountCreated') }
        } catch (profileError) {
          // 如果创建配置文件失败，删除认证用户
          await userCredential.user.delete()
          throw new Error(t('auth.profileCreationError'))
        }
      } catch (error) {
        let errorMessage;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = t('auth.emailInUse')
            break
          case 'auth/invalid-email':
            errorMessage = t('contact.form.emailValid')
            break
          case 'auth/weak-password':
            errorMessage = t('auth.passwordRequirements')
            break
          default:
            errorMessage = error.message
        }
        this.error = errorMessage
        throw new Error(errorMessage)
      } finally {
        this.loading = false
      }
    },

    async login({ email, password, rememberMe = false }, t) {
      this.loading = true
      try {
        await setPersistence(auth, 
          rememberMe ? browserLocalPersistence : browserSessionPersistence
        )
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        await this.loadUserProfile(userCredential.user.uid)
        this.error = null
        return { success: true, message: t('auth.loginSuccess') }
      } catch (error) {
        let errorMessage = error.message
        if (error.code === 'auth/invalid-credential') {
          errorMessage = t('auth.invalidCredentials')
        }
        this.error = errorMessage
        return { success: false, message: errorMessage }
      } finally {
        this.loading = false
      }
    },

    async logout(t) { // 直接接收 t 函数作为参数
      try {
        await signOut(auth)
        this.user = null
        this.userProfile = null
        return { 
          success: true, 
          message: t('auth.logoutSuccess') // 使用传入的 t 函数
        }
      } catch (error) {
        return { 
          success: false, 
          message: t('auth.logoutError') || error.message // 统一使用i18n
        }
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

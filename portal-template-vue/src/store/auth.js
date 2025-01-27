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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,
    error: null,
    authUnsubscribe: null // Store the unsubscribe function
  }),

  actions: {
    async loadUserProfile(uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
          this.userProfile = userDoc.data()
        } else {
          // Create new user profile
          const newProfile = {
            name: 'Adrian Wang', // Default name
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
        const userRef = doc(db, 'users', uid)
        await updateDoc(userRef, data)
        // Get and return updated complete data
        const docSnap = await getDoc(userRef)
        this.userProfile = docSnap.data()
        return docSnap.data()
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error // Throw error to handle in component
      }
    },

    async register({ username, email, password }, t) {
      if (this.loading) return
      this.loading = true
      this.error = null

      try {
        // 1. Create authentication user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        try {
          // 2. Create user profile
          const newProfile = {
            name: username,
            phone: '',
            bio: '',
            createdAt: new Date().toISOString()
          }
          await setDoc(doc(db, 'users', userCredential.user.uid), newProfile)

          // 3. Update state
          this.user = userCredential.user
          this.userProfile = newProfile

          return { success: true, message: t('auth.accountCreated') }
        } catch (profileError) {
          // If profile creation fails, delete the authentication user
          await userCredential.user.delete()
          throw new Error(t('auth.profileCreationError'))
        }
      } catch (error) {
        let errorMessage
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
        // Set persistence based on rememberMe
        const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence
        await setPersistence(auth, persistence)

        // Sign in with new persistence settings
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // Update store state
        this.user = userCredential.user
        await this.loadUserProfile(userCredential.user.uid)
        this.error = null

        // Store persistence setting in localStorage
        localStorage.setItem('auth_persistence', rememberMe ? 'local' : 'session')

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

    async logout(t) {
      if (this.authUnsubscribe) {
        this.authUnsubscribe()
        this.authUnsubscribe = null
      }

      try {
        await signOut(auth)
        this.user = null
        this.userProfile = null
        return {
          success: true,
          message: t('auth.logoutSuccess')
        }
      } catch (error) {
        return {
          success: false,
          message: t('auth.logoutError') || error.message
        }
      }
    },

    initializeAuthListener() {
      return new Promise(resolve => {
        // Apply saved persistence setting on initialization
        const savedPersistence = localStorage.getItem('auth_persistence')
        if (savedPersistence) {
          const persistence =
            savedPersistence === 'local' ? browserLocalPersistence : browserSessionPersistence
          setPersistence(auth, persistence)
        }

        // Track if initial auth state has been resolved
        let initialAuthResolved = false

        // Store unsubscribe function in state for cleanup
        this.authUnsubscribe = onAuthStateChanged(auth, async user => {
          if (user) {
            this.user = user
            await this.loadUserProfile(user.uid)
          } else {
            this.user = null
            this.userProfile = null
          }

          // Resolve promise on first auth state change
          if (!initialAuthResolved) {
            initialAuthResolved = true
            resolve()
          }
        })

        // Fallback timeout in case auth state doesn't change
        setTimeout(() => {
          if (!initialAuthResolved) {
            initialAuthResolved = true
            resolve()
          }
        }, 1000)
      })
    },

    clearError() {
      this.error = null
    }
  },

  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => ({
      ...state.user,
      name: state.userProfile?.name
    }),
    hasError: state => !!state.error,
    authError: state => state.error
  }
})

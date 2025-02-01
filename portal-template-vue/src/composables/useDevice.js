import { useDisplay } from 'vuetify'
import { computed } from 'vue'

export const useDevice = () => {
  const { mobile } = useDisplay()

  const isMobile = computed(() => mobile.value)

  return {
    isMobile
  }
}

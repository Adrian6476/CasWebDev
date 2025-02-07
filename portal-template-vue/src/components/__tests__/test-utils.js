import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

export function createVuetifyInstance() {
  return createVuetify({
    components
  })
}

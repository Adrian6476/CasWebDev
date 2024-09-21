<template>
  <div class="document-viewer">
    <v-row>
      <v-col :cols="12" :md="showToc ? 9 : 12">
        <md-content :content="content" />
      </v-col>
      <v-col v-if="showToc" cols="3">
        <md-toc :content="content" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import MdContent from './MdContent.vue';
import MdToc from './MdToc.vue';
import { ConfigService } from '../services/ConfigService';
import { useDisplay } from 'vuetify';

const props = defineProps(['docId', 'lang']);
const content = ref('');
const { mdAndUp, lgAndUp, orientation } = useDisplay();

const showToc = computed(() => {
  return lgAndUp.value || (mdAndUp.value && orientation.value !== 'portrait');
});

async function fetchContent() {
  const configService = ConfigService.getInstance();
  const defaultLang = configService.defaultLang;

  const lang = props.lang || defaultLang;
  try {
    let response = await fetch(`/src/app/doc/${lang}/${props.docId}.md`);
    if (response.ok) {
      content.value = await response.text();
    } else if (lang !== defaultLang) {
      // Fallback to default language
      response = await fetch(`/src/app/doc/${defaultLang}/${props.docId}.md`);
      if (response.ok) {
        content.value = await response.text();
      } else {
        content.value = '# Document not found';
      }
    } else {
      content.value = '# Document not found';
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    content.value = '# Error loading document';
  }
}

onMounted(fetchContent);

watch(() => [props.docId, props.lang], fetchContent);
</script>

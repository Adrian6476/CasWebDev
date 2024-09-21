<!-- week6/MarkVue/src/components/DocumentViewer.vue -->

<template>
  <div class="document-viewer">
    <md-content :content="content" />
    <md-toc :content="content" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import MdContent from './MdContent.vue';
import MdToc from './MdToc.vue';
import { ConfigService } from '../services/ConfigService';

const props = defineProps(['docId', 'lang']);
const content = ref('');

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

<template>
  <div v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import type { Tokens, MarkedExtension } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const props = defineProps<{ content: string }>();

// Configure marked options
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

// Define custom token interface
interface MathToken extends Tokens.Generic {
  type: 'inlineMath' | 'blockMath';
  text: string;
}

// Custom inline extension for inline math
const inlineMathExtension: MarkedExtension = {
  name: 'inlineMath',
  level: 'inline',
  start(src: string) {
    return src.indexOf('$');
  },
  tokenizer(src: string): MathToken | void {
    const match = src.match(/^\$([^\$]+?)\$/);
    if (match) {
      return {
        type: 'inlineMath',
        raw: match[0],
        text: match[1],
      };
    }
  },
  renderer(token: Tokens.Generic): string | false | void {
    const mathToken = token as MathToken;
    return katex.renderToString(mathToken.text, { throwOnError: false });
  },
};

// Custom block extension for display math
const blockMathExtension: MarkedExtension = {
  name: 'blockMath',
  level: 'block',
  start(src: string) {
    return src.indexOf('$$');
  },
  tokenizer(src: string): MathToken | void {
    const match = src.match(/^\$\$([\s\S]+?)\$\$/);
    if (match) {
      return {
        type: 'blockMath',
        raw: match[0],
        text: match[1],
      };
    }
  },
  renderer(token: Tokens.Generic): string | false | void {
    const mathToken = token as MathToken;
    return `<div class="math">${katex.renderToString(mathToken.text, { throwOnError: false, displayMode: true })}</div>`;
  },
};

marked.use({ extensions: [inlineMathExtension, blockMathExtension] });

const renderedContent = computed(() => {
  let html = marked(props.content) as string;
  html = DOMPurify.sanitize(html, {
    ADD_ATTR: ['class', 'style'],
    ALLOW_UNKNOWN_PROTOCOLS: true,
  });
  return html;
});
</script>

<style scoped>
:deep(h1) { font-size: 2em; font-weight: bold; margin-top: 0.67em; margin-bottom: 0.67em; }
:deep(h2) { font-size: 1.5em; font-weight: bold; margin-top: 0.83em; margin-bottom: 0.83em; }
:deep(h3) { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 1em; }
:deep(h4) { font-size: 1em; font-weight: bold; margin-top: 1.33em; margin-bottom: 1.33em; }
:deep(h5) { font-size: 0.83em; font-weight: bold; margin-top: 1.67em; margin-bottom: 1.67em; }
:deep(h6) { font-size: 0.67em; font-weight: bold; margin-top: 2.33em; margin-bottom: 2.33em; }

:deep(strong) { font-weight: bold; }
:deep(em) { font-style: italic; }
:deep(u) { text-decoration: underline; }
:deep(del) { text-decoration: line-through; }

:deep(ul), :deep(ol) { padding-left: 2em; }
:deep(li) { margin-bottom: 0.5em; }

:deep(ul.task-list) { list-style-type: none; }
:deep(li.task-list-item) { display: flex; align-items: center; }
:deep(li.task-list-item input[type="checkbox"]) { margin-right: 0.5em; }

:deep(pre) { background-color: #f4f4f4; padding: 1em; border-radius: 4px; overflow-x: auto; }
:deep(code) { font-family: monospace; }
:deep(blockquote) { border-left: 4px solid #ccc; margin: 1em 0; padding: 0.5em 1em; }

.math {
  overflow-x: auto;
  margin: 1em 0;
}

/* Responsive styles */
@media (max-width: 600px) {
  :deep(h1) { font-size: 1.5em; }
  :deep(h2) { font-size: 1.3em; }
  :deep(h3) { font-size: 1.1em; }
  :deep(h4), :deep(h5), :deep(h6) { font-size: 1em; }

  :deep(ul), :deep(ol) { padding-left: 1em; }
  
  :deep(pre) { padding: 0.5em; }
  
  :deep(blockquote) { margin: 0.5em 0; padding: 0.25em 0.5em; }
}

@media (max-width: 400px) {
  :deep(h1) { font-size: 1.3em; }
  :deep(h2) { font-size: 1.2em; }
  :deep(h3), :deep(h4), :deep(h5), :deep(h6) { font-size: 1em; }
}
</style>
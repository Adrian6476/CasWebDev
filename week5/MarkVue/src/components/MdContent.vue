<template>
    <div v-html="renderedContent"></div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github.css';
  
  const props = defineProps(['content']);
  
  // Configure marked options
  marked.setOptions({
    highlight: function (code, lang) {
      // Check if the language is valid, otherwise use 'plaintext'
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      // Highlight the code using highlight.js
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-', // Adds 'hljs language-<lang>' to <code> elements
  });  
  
  // Custom inline extension for inline math
  const inlineMathExtension = {
    name: 'inlineMath',
    level: 'inline', // Indicates inline token
    start(src) {
      return src.indexOf('$'); // Trigger tokenizer when '$' is found
    },
    tokenizer(src) {
      const match = src.match(/^\$([^\$]+?)\$/);
      if (match) {
        return {
          type: 'inlineMath',
          raw: match[0],
          text: match[1],
        };
      }
      return;
    },
    renderer(token) {
      return katex.renderToString(token.text, { throwOnError: false });
    },
  };
  
  // Custom block extension for display math
  const blockMathExtension = {
    name: 'blockMath',
    level: 'block', // Indicates block-level token
    start(src) {
      return src.indexOf('$$'); // Trigger tokenizer when '$$' is found
    },
    tokenizer(src) {
      const match = src.match(/^\$\$([\s\S]+?)\$\$/);
      if (match) {
        return {
          type: 'blockMath',
          raw: match[0],
          text: match[1],
          tokens: this.lexer.blockTokens(match[1]), // Tokenize the content inside $$...$$
        };
      }
      return;
    },
    renderer(token) {
      return `<div class="math">${katex.renderToString(token.text, { throwOnError: false, displayMode: true })}</div>`;
    },
  };
  
  // Use the extensions
  marked.use({ extensions: [inlineMathExtension, blockMathExtension] });
  
  const renderedContent = computed(() => {
  // Parse Markdown to HTML
  let html = marked(props.content);

  // Sanitize HTML with custom settings
  html = DOMPurify.sanitize(html, {
    ADD_ATTR: ['class', 'style'],
    ALLOW_UNKNOWN_PROTOCOLS: true,
  });

  return html;
});

  </script>
  
  <style scoped>
  /* Add styles for different heading levels */
  :deep(h1) { font-size: 2em; font-weight: bold; margin-top: 0.67em; margin-bottom: 0.67em; }
  :deep(h2) { font-size: 1.5em; font-weight: bold; margin-top: 0.83em; margin-bottom: 0.83em; }
  :deep(h3) { font-size: 1.17em; font-weight: bold; margin-top: 1em; margin-bottom: 1em; }
  :deep(h4) { font-size: 1em; font-weight: bold; margin-top: 1.33em; margin-bottom: 1.33em; }
  :deep(h5) { font-size: 0.83em; font-weight: bold; margin-top: 1.67em; margin-bottom: 1.67em; }
  :deep(h6) { font-size: 0.67em; font-weight: bold; margin-top: 2.33em; margin-bottom: 2.33em; }
  
  /* Styles for text formatting */
  :deep(strong) { font-weight: bold; }
  :deep(em) { font-style: italic; }
  :deep(u) { text-decoration: underline; }
  :deep(del) { text-decoration: line-through; }
  
  /* Styles for lists */
  :deep(ul), :deep(ol) { padding-left: 2em; }
  :deep(li) { margin-bottom: 0.5em; }
  
  /* Styles for task lists */
  :deep(ul.task-list) { list-style-type: none; }
  :deep(li.task-list-item) { display: flex; align-items: center; }
  :deep(li.task-list-item input[type="checkbox"]) { margin-right: 0.5em; }
  
  /* Styles for code blocks and blockquotes */
  :deep(pre) { background-color: #f4f4f4; padding: 1em; border-radius: 4px; overflow-x: auto; }
  :deep(code) { font-family: monospace; }
  :deep(blockquote) { border-left: 4px solid #ccc; margin: 1em 0; padding: 0.5em 1em; }
  
  /* Styles for math blocks */
  .math {
    overflow-x: auto;
    margin: 1em 0;
  }
  </style>
  
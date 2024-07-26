#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';

const program = new Command();

program
  .name('mdc')
  .description('Markdown to GitHub styled HTML converter')
  .version('1.0.0')
  .argument('<file>', 'Markdown file to convert')
  .action((file) => {
    const mdFilePath = path.resolve(process.cwd(), file);
    const htmlFilePath = mdFilePath.replace(/\.md$/, '.html');
    const cssFilePath = path.resolve(__dirname, '../public/github-markdown.min.css');

    fs.readFile(mdFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        process.exit(1);
      }

      fs.readFile(cssFilePath, 'utf8', (cssErr, cssData) => {
        if (cssErr) {
          console.error(`Error reading CSS file: ${cssErr}`);
          process.exit(1);
        }

        const htmlContent = `
          <!doctype html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>${cssData}</style>
            <title>Markdown Preview</title>
          </head>
          <body class="markdown-body">
            ${marked(data)}
          </body>
          </html>
        `;

        fs.writeFile(htmlFilePath, htmlContent, (err) => {
          if (err) {
            console.error(`Error writing file: ${err}`);
            process.exit(1);
          }
          console.log(`Converted ${file} to HTML: ${htmlFilePath}`);
        });
      });
    });
  });

program.parse(process.argv);

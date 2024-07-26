#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const marked_1 = require("marked");
const program = new commander_1.Command();
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
            ${(0, marked_1.marked)(data)}
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


# Markdown Viewer

This is a Vue.js-based Markdown viewer application that allows users to navigate and view Markdown files dynamically. It uses YAML-based navigation and supports nested routing.

## Features

- Dynamic routing based on YAML configuration
- Markdown parsing and rendering
- Nested navigation structure
- 404 error handling for non-existent pages

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

## Installation

**Install dependencies:**
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

3. Use the navigation menu to browse through different Markdown files.

## Project Structure

- `src/components/`: Vue components
  - `NavMenu.vue`: Navigation menu component
  - `TextDisplay.vue`: Markdown display component
- `src/views/`: Vue views
- `src/router/`: Vue Router configuration
- `src/assets/`: Static assets
  - `markdown/`: Markdown files
  - `toc.yaml`: YAML file for navigation structure

## Customization

- To add or modify navigation items, edit the `src/assets/toc.yaml` file.
- To add new Markdown files, place them in the `src/assets/markdown/` directory and update the `toc.yaml` file accordingly.

## Built With

- [Vue.js](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [marked](https://github.com/markedjs/marked)
- [js-yaml](https://github.com/nodeca/js-yaml)
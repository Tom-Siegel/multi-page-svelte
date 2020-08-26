# multi-page-svelte

Create multiple svelte-pages with this template. Relies on default template https://github.com/sveltejs/template

## Usage

```shell
npx degit Tom-Siegel/multi-page-svelte
```

1. Create as many Page-files as you want (see src/main.js or src/second.js)
2. Go to rollup-pages.config.js and set the inputs

```javascript
const inputs = ["main", "second"];
```

3. Build the project

```shell
npm run build
```

4. Set up your html-files by adding the main.js, main.css and global.css

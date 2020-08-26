# multi-page-svelte

Create multiple svelte-pages with this template. Relies on default template https://github.com/sveltejs/template

## Usage

```shell
npx degit Tom-Siegel/multi-page-svelte
```

1. Create as many Page-files as you want (see src/main.js or src/second.js)
2. Go to rollup-pages.config.js and set the inputs

```javascript
const inputs = [
  "main", //string defaults to input: src/[name].js and output: public/build/[name].js
  {
    input: "src/second.js",
    output: { file: "public/build/second.js", name: "second" },
    css: "public/build/second.css",
  }, //object for setting more specific values for input and output of roolup configuration
];
```

3. Set up your html-files by adding the main.js, main.css and global.css
4. Build the project

```shell
npm run build
```

## Testing

```shell
npm run dev
```

Or

```shell
npm run start
```

Open your browser url: localhost:5000

main.js --> http://localhost:5000/index.html

second.js --> http://localhost:5000/second.html

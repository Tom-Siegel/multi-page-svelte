import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const inputs = [
  "main", //string defaults to input: src/[name].js and output: public/build/[name].js
  {
    input: "src/second.js",
    output: { file: "public/build/second.js", name: "second" },
    css: "public/build/second.css",
  }, //object for setting more specific values for input and output of roolup configuration
];
const production = !process.env.ROLLUP_WATCH;

//!!!
//To change rollup configuration go to createPageRollupExport (function)
//!!!

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}
function createPageRollupExport(inp) {
  //nearly default config as in https://github.com/sveltejs/template
  //TODO add possibilty for different option with different inputs and destinations.
  const t = typeof inp;
  const input =
    t === "string"
      ? createPageInputByString(inp)
      : createPageInputByObject(inp);
  const output =
    t === "string"
      ? createPageOutputByString(inp)
      : createPageOutputByObject(inp);
  const cssPath =
    t === "string" ? createPageCssByString(inp) : createPageCssByObject(inp);

  let def = {
    input: input,
    output: output,
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: (css) => {
          css.write(cssPath);
        },
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload("public"),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  };

  return def;
}

//#region utilities

function createPageInputByString(inp) {
  return `src/${inp}.js`;
}

function createPageInputByObject(inp) {
  return isStringNotNull(inp.input) ? inp.input : "src/main.js";
}

function createPageCssByString(inp) {
  return `public/build/${inp}.css`;
}

function createPageCssByObject(inp) {
  return isStringNotNull(inp.css) ? inp.css : "public/build/main.css";
}

function createPageOutputByString(inp) {
  return {
    sourcemap: false,
    format: "iife",
    name: `${inp}`,
    file: `public/build/${inp}.js`,
  };
}

function createPageOutputByObject(inp) {
  let def = {
    sourcemap: false,
    format: "iife",
    name: "main",
    file: `public/build/main.js`,
  };

  return Object.assign(def, inp.output);
}

function validateInputSettings(inp) {
  return (
    isStringNotNull(inp) ||
    (typeof inp === "object" && inp.input && inp.output && inp.css)
  );
}

function isStringNotNull(str) {
  return typeof str === "string" && str.length > 0;
}

//#endregion

export default (function () {
  let arrExportRollup = [];

  if (inputs instanceof Array) {
    inputs.forEach((i, index) => {
      if (validateInputSettings(i)) {
        arrExportRollup.push(createPageRollupExport(i));
      } else {
        console.warn(`skipping inputs${index} because of invalidity`);
      }
    });
  } else {
    throw new Error("inputs needs to be type of Array!");
  }
  return arrExportRollup;
})();

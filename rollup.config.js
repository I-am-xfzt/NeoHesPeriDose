import resolve from "@rollup/plugin-node-resolve";
export default {
  input: "./src/components/model/loadModel.js",
  output: [
    {
      format: "umd",
      file: "./public/bundle.js",
      name: "datascreen"
    },
  ],
  plugins: [resolve()],
};
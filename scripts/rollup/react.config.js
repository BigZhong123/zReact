import { resolvePkgPath, getPkgJson, getBaseRollupplugins } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";

const { name, module } = getPkgJson("react");
// react包路径
const pkgPath = resolvePkgPath(name);
// react产物路径
const pkgDistPath = resolvePkgPath(name, true);

export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: "index.js",
      format: "umd",
    },
    plugins: [
      ...getBaseRollupplugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: "index.js",
        }),
      }),
    ],
  },
  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      // jsx-runtime
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: "jsx-runtime.js",
        format: "umd",
      },
      // jsx-dev-runtime
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: "jsx-dev-runtime.js",
        format: "umd",
      },
    ],
    plugins: getBaseRollupplugins(),
  },
];

#!/usr/bin/env node
/**
 * Copyright seo jeong hwan [restnfeel@gmail.com]
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const chalk = require("chalk");
const path = require("path");
const commander = require("commander");
const _cliProgress = require("cli-progress");
const fs = require("fs-extra");
const os = require("os");

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split(".");
const major = semver[0];

const tempLoc = path.resolve(
  __dirname,
  "../packages/create-rest-parcel-template"
);

/**
 * 사용자가 입력한 위치에서 모듈명을 결합시켜줍니다.
 */
const userDirCheck = function(dName) {
  let currentDir = process.cwd();
  let makeDirName = path.resolve(currentDir, dName);
  return makeDirName;
};

/**
 * 템플릿을 사용자가 지정한 프로젝트로 복사합니다.
 */
const copyTemplateToUserDir = function(userPath) {
  fs.copy(tempLoc, userPath, function(errr) {
    return false;
  });
  return true;
};

const showCompleteMessage = function(createDirName, modulename) {
  console.log(
    chalk.cyan(
      "##################################################################"
    )
  );
  console.log();
  console.log(
    chalk.cyan(" Welcome! Create REST Parcel CLI, Made by RestNFeel")
  );
  console.log();
  console.log(chalk.cyan(" REST Parcel 이 생성되었습니다."));
  console.log(chalk.cyan(" [생성위치] : %s"), createDirName);
  console.log(
    chalk.cyan(" 아래 절차대로 초기 세팅후 모듈개발을 하시기 바랍니다.")
  );
  console.log();
  console.log(chalk.cyan(" cd %s"), modulename);
  console.log(chalk.cyan(" yarn install"));
  console.log();
  console.log(chalk.cyan(" yarn build"));
  console.log();
  console.log(chalk.cyan(" yarn start"));
  console.log();
  console.log(
    chalk.cyan(
      "##################################################################"
    )
  );
};

/**
 * package.json 만들기.
 */
const makePackageJson = async function(modulename) {
  let packageJson = {
    name: modulename,
    version: "0.1.0",
    description: "",
    main: "./build/" + modulename + ".min.js",
    scripts: {
      prestart: "rimraf ./dist",
      start: "parcel ./index.html",
      prebuild: "rimraf ./build",
      build:
        "parcel build production.js --out-file " +
        modulename +
        ".min.js -d build --public-url ./",
      doc: "./node_modules/.bin/esdoc",
      test: "jest --watchAll"
    },
    keywords: ["create-rest-module", modulename],
    author: "Developer [" + os.hostname + "]",
    license: "MIT",
    dependencies: {
      autoprefixer: "^9.3.1",
      axios: "^0.18.0",
      mobx: "^5.5.1",
      "mobx-react": "^5.3.4",
      "node-sass": "^4.10.0",
      npm: "^6.4.1",
      "postcss-modules": "^1.4.1",
      "prop-types": "^15.6.2",
      react: "^16.5.2",
      "react-dom": "^16.5.2",
      "react-helmet": "^5.2.0",
      "react-router-dom": "^4.3.1",
      "restnfeel-ui": "^0.0.18",
      "semantic-ui-css": "^2.4.1",
      "semantic-ui-react": "^0.83.0",
      typography: "^0.16.17",
      graphql: "^14.0.2",
      "graphql-tag": "^2.10.0"
    },
    devDependencies: {
      cssnano: "^4.1.7",
      sass: "^1.15.1",
      "@babel/core": "^7.1.0",
      "@babel/plugin-external-helpers": "^7.0.0",
      "@babel/plugin-proposal-class-properties": "^7.1.0",
      "@babel/plugin-proposal-decorators": "^7.1.0",
      "@babel/plugin-syntax-dynamic-import": "^7.0.0",
      "@babel/plugin-transform-parameters": "^7.1.0",
      "@babel/plugin-transform-runtime": "^7.0.0",
      "@babel/polyfill": "^7.0.0",
      "@babel/preset-env": "^7.0.0",
      "@babel/preset-flow": "^7.0.0",
      "@babel/preset-react": "^7.0.0",
      "@babel/register": "^7.0.0",
      "@babel/runtime": "^7.0.0",
      "apollo-boost": "^0.1.22",
      "babel-core": "7.0.0-bridge.0",
      "babel-jest": "^23.6.0",
      "babel-plugin-transform-class-properties": "^6.24.1",
      "babel-plugin-transform-es2015-modules-commonjs": "^6.26.2",
      "babel-preset-jest": "^23.2.0",
      "babel-preset-mobx": "^2.0.0",
      enzyme: "^3.6.0",
      "enzyme-adapter-react-16": "^1.5.0",
      "enzyme-to-json": "^3.3.4",
      esdoc: "^1.1.0",
      "esdoc-ecmascript-proposal-plugin": "^1.0.0",
      "esdoc-flow-plugin": "^1.0.0",
      "esdoc-flow-type-plugin": "^1.1.0",
      "esdoc-jsx-plugin": "^1.0.0",
      "esdoc-standard-plugin": "^1.0.0",
      "flow-bin": "^0.82.0",
      "flow-typed": "^2.5.1",
      jest: "^23.6.0",
      "react-apollo": "^2.3.2",
      "react-test-renderer": "^16.5.2",
      "regenerator-runtime": "^0.12.1",
      rimraf: "^2.6.2"
    }
  };

  await fs.writeFileSync(
    path.join(tempLoc, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL,
    function(errr) {
      return false;
    }
  );
  return true;
};

if (major < 8) {
  console.error(
    chalk.red(
      "You are running Node " +
        currentNodeVersion +
        ".\n" +
        "Create Rest Parcel CLI는 node 8 버전 이상에서 작동됩니다. \n" +
        "node 버전 업데이트를 하십시오."
    )
  );
  process.exit(1);
} else {
  // 사용자가 입력한 폴더를 생성하고 템플릿 소스를 넣어준다.
  commander
    .arguments("<modulename>")
    .action(async function(modulename) {
      let createDirName = userDirCheck(modulename);

      const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
      bar.start(100, 0);

      let step2 = await makePackageJson(modulename);
      let promiseOne = new Promise((resolve, reject) => {
        if (step2) {
          resolve("success");
        } else {
          reject("make package json file error");
        }
      });

      let step3 = await copyTemplateToUserDir(createDirName);
      let promiseThree = new Promise((resolve, reject) => {
        if (step3) {
          resolve("success");
        } else {
          reject("copyTemplateToUserDir error");
        }
      });

      // promise go
      promiseOne
        .then(res2 => {
          bar.update(70);
          return promiseThree;
        })
        .then(res3 => {
          bar.update(100);
          bar.stop();

          showCompleteMessage(createDirName, modulename);
        })
        .catch(err => {
          console.error("[create-rest-parcel Error] ", err);
          process.exit(1);
        });
    })
    .parse(process.argv);
}

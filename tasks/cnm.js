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
      start: "parcel ./index.html",
      build: "parcel build index.html -d build --public-url ./",
      test: 'echo "Error: no test specified" && exit 1'
    },
    keywords: ["create-rest-module", modulename],
    author: "Developer [" + os.hostname + "]",
    license: "MIT",
    dependencies: {
      autoprefixer: "^9.3.1",
      "node-sass": "^4.10.0",
      "postcss-modules": "^1.4.1",
      react: "^16.6.3",
      "react-dom": "^16.6.3",
      typography: "^0.16.17"
    },
    devDependencies: {
      "babel-core": "^6.26.3",
      "babel-preset-env": "^1.7.0",
      "babel-preset-react": "^6.24.1",
      cssnano: "^4.1.7",
      sass: "^1.15.1"
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

      let step1 = await makePublicHtml(modulename);
      let promiseOne = new Promise((resolve, reject) => {
        if (step1) {
          resolve("success");
        } else {
          reject("make index html file error");
        }
      });

      let step2 = await makePackageJson(modulename);
      let promiseTwo = new Promise((resolve, reject) => {
        if (step2) {
          resolve("success");
        } else {
          reject("make package json file error");
        }
      });

      // promise go
      promiseOne
        .then(res1 => {
          bar.update(30);
          return promiseTwo;
        })
        .then(res2 => {
          bar.update(70);

          showCompleteMessage(createDirName, modulename);
        })
        .catch(err => {
          console.error("[create-rest-parcel Error] ", err);
          process.exit(1);
        });
    })
    .parse(process.argv);
}

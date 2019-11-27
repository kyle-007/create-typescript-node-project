#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
var O = __importStar(require("fp-ts/lib/Option"));
var pipeable_1 = require("fp-ts/lib/pipeable");
var IOEither = __importStar(require("fp-ts/lib/IOEither"));
var IO = __importStar(require("fp-ts/lib/IO"));
var Apply_1 = require("fp-ts/lib/Apply");
var currentDir = process.cwd();
var steps = pipeable_1.pipe(O.fromNullable(process.argv[2]), O.map(function (name) { return currentDir + "/" + name; }), IOEither.fromOption(function () { return 'Usage: create-typescript-node-project <your project name>'; }), IOEither.chain(function (projectName) { return pipeable_1.pipe(IOEither.tryCatch(function () { return fs_1.default.mkdirSync(projectName); }, function (reason) { return reason; }), IOEither.chain(function () { return IOEither.tryCatch(function () { return child_process_1.execSync("cp LICENSE package.json README.md tsconfig.json tslint.json jest.config.js " + projectName + "/."); }, function (error) { return error; }); }), IOEither.chain(function () { return IOEither.tryCatch(function () { return child_process_1.execSync("cp -r src " + projectName + "/."); }, function (error) { return error; }); }), IOEither.chain(function () { return IOEither.tryCatch(function () { return child_process_1.execSync("echo 'console.log(\"Hello, world!\");' > " + projectName + "/src/index.ts"); }, function (error) { return error; }); }), IOEither.map(function () { return "Project " + projectName + " created successfully"; })); }), IOEither.getOrElse(function (error) { return IO.of(error); }));
Apply_1.sequenceT(IO.io)(steps)()
    .map(console.log);

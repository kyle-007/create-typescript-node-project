#!/usr/bin/env node
import { execSync } from "child_process";
import fs from 'fs';
import * as O from 'fp-ts/lib/Option';
import {pipe} from "fp-ts/lib/pipeable";
import * as IOEither from 'fp-ts/lib/IOEither';
import * as IO from 'fp-ts/lib/IO';
import {sequenceT} from "fp-ts/lib/Apply";

const currentDir = process.cwd();
const steps = pipe(
    O.fromNullable(process.argv[2]),
    O.map(name => `${currentDir}/${name}`),
    IOEither.fromOption(() => 'Usage: create-typescript-node-project <your project name>'),
    IOEither.chain(projectName => pipe(
        IOEither.tryCatch(() => fs.mkdirSync(projectName), reason => reason),
        IOEither.chain(() => IOEither.tryCatch(() => execSync(`cp LICENSE package.json README.md tsconfig.json tslint.json jest.config.js ${projectName}/.`), error => error)),
        IOEither.chain(() => IOEither.tryCatch(() => execSync(`cp -r src ${projectName}/.`), error => error)),
        IOEither.chain(() => IOEither.tryCatch(() => execSync(`echo 'console.log("Hello, world!");' > ${projectName}/src/index.ts`), error => error)),
        IOEither.map(() => `Project ${projectName} created successfully`)
    )),
    IOEither.getOrElse(error => IO.of(error)),
);

sequenceT(IO.io)(steps)()
    .map(console.log);

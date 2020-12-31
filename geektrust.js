import fs from 'fs';
import execute from './src/commands/index.js';
import * as RESONSES from './src/constants/responses.js';

const filename = process.argv[2];

const parseInput = (input) => {
  const statements = input.split('\n').filter((line) => line.trim().length);
  statements.forEach((statement) => execute(statement));
};

try {
  fs.readFile(filename, (_, data) => {
    parseInput(data.toString());
  });
} catch {
  console.log(RESONSES.INVALID_ARGUMENT);
}

import fs from 'fs';
import execute from './src/commands/index.js';

const filename = process.argv[2];

const parseInput = (input) => {
  const statements = input.split('\n').filter((line) => line.trim().length);
  statements.forEach((statement) => execute(statement));
};

fs.readFile(filename, (err, data) => {
  parseInput(data.toString());
});

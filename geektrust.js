import execute from "./src/commands/index.js";
import fs from "fs";

const filename = process.argv[2];

fs.readFile(filename, function (err, data) {
  parseInput(data.toString());
});

const parseInput = (input) => {
  const statements = input.split("\n").filter((line) => line.trim().length);
  statements.forEach((statement) => execute(statement));
};

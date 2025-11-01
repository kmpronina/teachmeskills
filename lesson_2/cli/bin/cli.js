#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");
const pkg = require("../package.json");

const argv = process.argv.slice(2);
const [command, ...rest] = argv;

const CONFIG_PATH = path.join(os.homedir(), ".hello-cli.json");

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveConfig(cnf) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cnf, null, 2), "utf8");
}

function printHelp() {
  console.log("Usage");
  console.log("node bin/cli.js <command> [options]/n");
  console.log("Options");
  console.log("help               show help");
  console.log("init               Init or update config");
  console.log("greet [..name|n]   greeting");
  console.log("add [a,b,c ...]    Increase");
  console.log("now                Show current datetime");
  console.log("version            Show cli version");
  console.log("config [get, set]  Show or update config");
}

function parseFlags(args) {
  const flags = { _: [], unknown: [] };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];

    if (a === "-n" || a === "--name") {
      flags.name = args[i + 1];
      i++;
    } else if (a.startsWith("--name")) {
      flags.name = a.split("=")[1];
    } else if (a.startsWith("-")) {
      flags.unknown.push(a);
    } else {
      flags._.push(a);
    }
  }

  return flags;
}

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => rl.question(question, resolve));
  rl.close();

  return answer;
}

async function main() {
  if (
    !command ||
    command === "help" ||
    rest.includes("-h") ||
    rest.includes("--help")
  ) {
    return printHelp();
  }

  const flags = parseFlags(rest);
  if (flags.unknown.length) {
    console.warn(`Unknown flags ${flags.unknown.join(", ")}`);
  }

  const cnf = loadConfig();

  switch (command) {
    case "version": {
      console.log(pkg.version);
      break;
    }

    case "now": {
      console.log(new Date().toISOString());
      break;
    }

    case "init": {
      let name = flags.name;
      if (!name) {
        name = await prompt("What is your name?");
      }
      const nextConfig = { ...cnf, name };
      saveConfig(nextConfig);

      console.log(`Ok! Config updated ${CONFIG_PATH}`);
      break;
    }

    case "greet": {
      const name = flags.name || cnf.name || "user";
      console.log(`Hello, ${name}!`);

      if (!cnf.name && !flags.name) {
        console.log(
          `Save your name with init command 'hello init --name John' `
        );
      }
      break;
    }

    case "add": {
      let nums = flags._.length ? flags._ : null;

      if (!nums) {
        const line = await prompt("Add numbers");
        nums = line.split(/\s+/).filter(Boolean);
      }

      const values = nums.map(Number);
      if (values.some(Number.isNaN)) {
        console.error("Only numbers allowed");
        process.exitCode = 1;
        return;
      }

      const sum = values.reduce((a, b) => a + b, 0);

      console.log(`Sum: ${sum}`);
      break;
    }

    case "config": {
      const arg = rest[0];

      if (arg === "get") {
        console.log(cnf);
      } else if (arg === "set") {
        const newOpt = await prompt('Enter "key"="value" formatted pair');

        const [key, value] = newOpt.split("=");

        if (!key || !value) {
          console.error('Only "key"="value" formatted pair allowed');
          process.exitCode = 1;
          return;
        }

        const updatedCnf = { ...cnf, [key]: value };
        saveConfig(updatedCnf);

        console.log(`Ok! Config updated ${CONFIG_PATH}`);
        return;
      } else {
        console.error(`Unknown command ${command}`);
        printHelp();
        return;
      }

      break;
    }

    default: {
      console.error(`Unknown command ${command}`);
      printHelp();
      process.exitCode = 1;
    }
  }
}

main().catch((e) => {
  console.error(e.stack || String(e));
  process.exit(1);
});

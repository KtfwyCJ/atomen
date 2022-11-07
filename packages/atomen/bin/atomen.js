#!/usr/bin/env node

const { program } = require("commander");

program
  .version(require("../package.json").version, "-v, -V", "输出当前框架的版本")
  .description("这是chengj的第一个练习框架")
  .action(function (name, other) {
    console.log(`
    这是chengj的第一个框架。

    支持的命令：
    version, -v,-V输出当前框架版本,
    help, -h, 帮助输出程序,
    
    Example call:
     $ atomen <command> --help
    `);
  })
  .usage("[<command> [options]]")
  .parse(process.argv);

program
  .command("help")
  .alias("-h")
  .description("帮助命令")
  .action(function (name, other) {
    console.log(`
    这是chengj的第一个框架。

支持的命令:
  version, -v,-V 输出当前框架的版本
  help,-h 输出帮助程序

Example call:
    $ atomen <command> --help`);
  });

// 开发命令，当用户执行atomen dev时，会require("../lib/dev")
program
  .command("dev")
  .description("框架开发命令")
  .action(function () {
    const { dev} = require("../lib/dev");
    dev();
  });

program.parse(process.argv);

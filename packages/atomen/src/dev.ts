import express from "express";
import { serve, build } from "esbuild";
import type { ServeOnRequestArgs } from "esbuild";
import path from "path";
import {
  DEFAULT_OUTDIR,
  DEFAULT_HOST,
  DEFAULT_BUILD_PORT,
  DEFAULT_PLATFORM,
  DEFAULT_ENTRY_POINT,
} from "./constants";

export const dev = async () => {
  const app = express();
  const cwd = process.cwd();
  app.get("/", (_req, res) => {
    res.set("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>atomen</title>
    </head>
    
    <body>
        <div id="atomen">
            <span>loading...</span>
        </div>
        <script src="http://${DEFAULT_HOST}:${DEFAULT_BUILD_PORT}/index.js"></script>
    </body>
    </html>`);
  });
  app.listen(8888, async () => {
    console.log(
      `App listening at http://${DEFAULT_HOST}:${DEFAULT_BUILD_PORT}`
    );
    try {
      const devServe = await serve(
        // 将文件生成在内存中而不是写到磁盘里
        {
          port: DEFAULT_BUILD_PORT,
          host: DEFAULT_HOST,
          servedir: DEFAULT_OUTDIR,
          // 为了有更多合理的日志，所以增加了 onRequest 配置
          onRequest: (args: ServeOnRequestArgs) => {
            if (args.timeInMS) {
              console.log(`${args.method}: ${args.path} ${args.timeInMS} ms`);
            }
          },
        },
        // 相当于执行: esbuild src/** --bundle --outdir=lib，即将一句命令拆分出来
        {
          format: "life",
          logLevel: "error",
          outdir: DEFAULT_OUTDIR,
          platform: DEFAULT_PLATFORM,
          bundle: true,
          // process.env.NODE_ENV 环境变量
          define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
          },
          entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
        }
      );
      process.on("SIGINT", () => {
        devServe.stop();
        process.exit(0);
      });
      process.on("SIGTERM", () => {
        devServe.stop();
        // 中止服务
        process.exit(1);
      });
    } catch (error) {
      console.log(error);
      // 中止服务
      process.exit(1);
    }
  });
};

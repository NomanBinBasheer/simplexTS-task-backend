import morgan from "morgan";
import colors from "colors";
import { MAX_BODY_LENGTH_MORGAN_LOGS, REQ_COLORS } from "@/lib/constants";
import type { Request } from "express";
import type { HttpVerbs } from "@/lib/types";

morgan.token("params", (req: Request, res) => {
  return JSON.stringify(req.params);
});

morgan.token("query", (req: Request, res) => {
  return JSON.stringify(req.query);
});

morgan.token("body", (req: Request, res) => {
  const allKeys = Object.keys(req.body);

  allKeys.forEach((k) => {
    if (k.toLowerCase().includes("password")) {
      req.body[k] = "****";
    }
  });
  return JSON.stringify(req.body);
});

morgan.token("colored-status", (req: Request, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? "red"
      : status >= 400
        ? "yellow"
        : status >= 300
          ? "cyan"
          : "green";
  return colors[color](status.toString());
});

morgan.token("colored-method", (req, res) => {
  const method: HttpVerbs = req.method as HttpVerbs;
  const color: string = REQ_COLORS[method] || "white";
  // console.log("Color:", color);
  //   @ts-expect-error
  return colors[color](method.toString());
});

const morganMiddleware = morgan(
  (tokens, req, res) => {
    const method = tokens["colored-method"] ? tokens["colored-method"](req, res) : req.method;
    const url = tokens.url ? tokens.url(req, res) : req.url;
    const status = tokens["colored-status"] ? tokens["colored-status"](req, res) : res.statusCode.toString();
    const contentLength = tokens.res ? tokens.res(req, res, "content-length") : res.getHeader("content-length");
    const responseTime = tokens["response-time"] ? tokens["response-time"](req, res) : "-";
    const params = tokens.params ? tokens.params(req, res) : "{}";
    const query = tokens.query ? tokens.query(req, res) : "{}";
    const body = tokens.body ? tokens.body(req, res) : "{}";

    // sliced the body to limit it because requests can have big bodies taking up the whole log screen
    return `\n${method} ${url} ${status} ${contentLength} - ${responseTime} ms: \n- Params: ${params} \n- Query: ${query} \n- Body: ${
      body && body.slice(0, MAX_BODY_LENGTH_MORGAN_LOGS)
    }...\n`;
  },
  {
    // Stream for morgan logs (you can customize this as needed)
    stream: process.stdout,
  },
);

export default morganMiddleware;

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import db from "./database";

import cors, { CorsOptions } from "cors";

const allowlist = ["http://localhost:3000"];

const corsOptionsDelegate = function (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) {
  var corsOptions;
  const header = req.header("Origin");
  if (allowlist.indexOf(header || "") !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json()); // <==== parse request body as JSON
app.use(cors(corsOptionsDelegate));

app.get("/", async (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/sum", async (req: Request, res: Response) => {
  const getHistories = () => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM history ORDER BY id DESC LIMIT 100",
        (err: Error, rows: any) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  };
  const result = await getHistories();

  res.json(result);
});

app.post("/sum", async (req: Request, res: Response) => {
  const { num1, num2 } = req.body;
  const result = num1 + num2;

  await db.run(
    `INSERT INTO history (number1, number2, result) VALUES (${num1}, ${num2}, ${result})`
  );

  res.json({ result });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

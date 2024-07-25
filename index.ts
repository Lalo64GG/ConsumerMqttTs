import express, { Request, Response } from "express";
import { getSensorData } from "./app"; // Asegúrate de que la ruta sea correcta
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";

dotenv.config();

const main = async () => {
  try {
    const app = express();
    app.use(cors());

    const PORT = process.env.PORT || 5000; // Puedes configurar el puerto en el archivo .env si lo deseas
    
    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, '../../../../etc/nginx/ssl/nginx-selfsigned.key')),
      cert: fs.readFileSync(path.join(__dirname, '../../../../etc/nginx/ssl/nginx-selfsigned.crt'))
    };

    app.get("/api/gas-level", (req: Request, res: Response) => {
      res.json({ 
        gas_level: getSensorData().gas_level,
        temperature: getSensorData().temperature
      });
    });

    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`Server is running on https://localhost:${PORT}`);
    });

  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
};

main();

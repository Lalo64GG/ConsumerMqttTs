import express, { Request, Response } from "express";
import { getSensorData } from "./app"; // Asegúrate de que la ruta sea correcta
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  try {
    const app = express();
    app.use(cors());
    const port = 5000;

    app.get("/api/gas-level", (req: Request, res: Response) => {
      res.json({ 
        gas_level: getSensorData().gas_level,
        temperature: getSensorData().temperature
       });
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
};

main();

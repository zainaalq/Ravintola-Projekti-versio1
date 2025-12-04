import express from "express";
import menuRoutes from "./routers/menu-Routes.js";
import drinkRoutes from "./routers/drinks-Routes.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());


app.use(express.static(path.join(__dirname, "../public")));


app.use("/api/menu", menuRoutes);
app.use("/api/drinks", drinkRoutes);



app.listen(3000, () => {
  console.log(" Server running at http://localhost:3000");
  console.log(" Frontend: http://localhost:3000/1.html");
});

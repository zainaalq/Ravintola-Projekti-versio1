import express from "express";
import menuRoutes from "./routers/menu-Routes.js";

const app = express();

app.use(express.json());

// Kytketään pizzareitit:
app.use("/api/menu", menuRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

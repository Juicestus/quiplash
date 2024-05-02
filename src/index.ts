import express from "express";
import cors from "cors";
import * as routes from "./routes";


const app = express();
const PORT = 3001;

app.use(express.json());

app.use(cors());
app.options("*", cors());

app.get("/createNewGame", routes.createNewGame);
app.get("/joinGame", routes.joinGame);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

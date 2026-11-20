import "dotenv/config"; // primero: app.js lee NODE_ENV al cargarse
import connectDatabase from "./config/MongoDb.js";
import app from "./app.js";

connectDatabase();

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));

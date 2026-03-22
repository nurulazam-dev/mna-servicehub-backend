import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const main = async () => {
  try {
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on PORT: ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Fail to start server", error);
  }
};

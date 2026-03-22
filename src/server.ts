import app from "./app";
import { envVars } from "./app/config/env";

const main = async () => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on PORT: ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Fail to start server", error);
  }
};

main();

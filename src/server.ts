import app from "./app";
import { envVars } from "./app/config/env";
// import { seedAdmin } from "./app/utils/seedAdmin";

const main = async () => {
  try {
    // 1st admin seed
    // await seedAdmin();

    app.listen(envVars.PORT, () => {
      console.log(`Server is running on PORT: ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Fail to start server", error);
  }
};

main();

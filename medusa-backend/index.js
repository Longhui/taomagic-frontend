const express = require("express");
const { Medusa } = require("@medusajs/medusa");
const cors = require("cors");

dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Medusa
const start = async () => {
  try {
    const medusa = await Medusa.loadApp();
    await medusa.bootstrap();

    const port = process.env.PORT || 9000;
    app.listen(port, () => {
      console.log(`🚀 Medusa backend running on port ${port}`);
    });
  } catch (err) {
    console.error("Error starting Medusa:", err);
    process.exit(1);
  }
};

start();

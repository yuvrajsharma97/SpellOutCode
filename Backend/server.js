require("dotenv").config();

// mongodb+srv:// requires DNS SRV record lookups, which some local/ISP
// resolvers (notably on Windows) fail to resolve — force a public resolver.
const dns = require("dns");
dns.setServers(["8.8.8.8"]);
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

const shutdownServer = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  }
};

process.on("SIGINT", () => shutdownServer("SIGINT"));
process.on("SIGTERM", () => shutdownServer("SIGTERM"));

startServer();

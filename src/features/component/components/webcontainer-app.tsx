import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { WebContainer } from "@webcontainer/api";

const Home: NextPage = () => {
  const [container, setContainer] = useState<WebContainer | null>(null);
  const [logs, setLogs] = useState<string>("");

  // Append output from the container's processes to the logs state
  const appendLog = (data: string) => {
    setLogs((prev) => prev + data);
  };

  useEffect(() => {
    async function bootContainer() {
      try {
        // Boot the WebContainer (a Node.js environment in the browser)
        const wc = await WebContainer.boot();
        setContainer(wc);

        // Set up a minimal package.json for the Node.js project
        const packageJSON = {
          name: "webcontainer-app",
          version: "1.0.0",
          main: "index.js",
          scripts: {
            start: "node index.js",
          },
          dependencies: {}
        };

        await wc.fs.writeFile(
          "package.json",
          JSON.stringify(packageJSON, null, 2)
        );

        // Create a basic index.js file that logs a message
        await wc.fs.writeFile(
          "index.js",
          `console.log("Hello from WebContainer!");`
        );

        // Spawn the process to run the application using the start script
        const process = await wc.spawn("npm", ["run", "start"]);
        process.output.pipeTo(
          new WritableStream({
            write(data) {
              appendLog(data);
            },
          })
        );
      } catch (error) {
        console.error("Error booting WebContainer:", error);
      }
    }

    bootContainer();
  }, []);

  // Function to dynamically install an external dependency (example: lodash)
  const handleInstallDependency = async () => {
    if (!container) return;
    try {
      // Read the current package.json file from the virtual file system
      const pkgString = await container.fs.readFile("package.json", "utf-8");
      const pkg = JSON.parse(pkgString);

      // Add lodash as a dependency (or any library you require)
      pkg.dependencies["lodash"] = "latest";

      // Write the updated package.json back to the virtual file system
      await container.fs.writeFile("package.json", JSON.stringify(pkg, null, 2));

      // Spawn a process to install the new dependency
      const installProcess = await container.spawn("npm", ["install", "lodash"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            appendLog(data);
          },
        })
      );
    } catch (error) {
      console.error("Error installing dependency:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>WebContainer in Next.js 14.2.8 with TypeScript</h1>
      <button onClick={handleInstallDependency} style={{ marginBottom: "1rem" }}>
        Install Lodash
      </button>
      <div
        style={{
          backgroundColor: "#000",
          color: "#0f0",
          padding: "1rem",
          minHeight: "300px",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      >
        {logs}
      </div>
    </div>
  );
};

export default Home;

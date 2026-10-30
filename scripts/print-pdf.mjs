/**
 * Renders an HTML file to a true A4 PDF.
 * Chrome's --print-to-pdf flag uses the platform default paper size (Letter),
 * so this drives Page.printToPDF over CDP with preferCSSPageSize enabled.
 *
 * Usage: node scripts/print-pdf.mjs resume.html public/resume.pdf
 */
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const [input = "resume.html", output = "public/resume.pdf"] = process.argv.slice(2);
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + path.join(process.env.TEMP || "/tmp", "chrome-print-profile"),
  "about:blank",
]);

let pageSocket;
let nextId = 1;
const pending = new Map();

function send(method, params = {}) {
  const id = nextId++;
  pageSocket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function waitForTarget() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      /* browser not up yet */
    }
    await sleep(250);
  }
  throw new Error("Chrome debugging endpoint did not become available");
}

try {
  const socketUrl = await waitForTarget();
  pageSocket = new WebSocket(socketUrl);

  await new Promise((resolve, reject) => {
    pageSocket.addEventListener("open", resolve, { once: true });
    pageSocket.addEventListener("error", reject, { once: true });
  });

  pageSocket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });

  await send("Page.enable");
  await send("Page.navigate", { url: `file:///${path.resolve(input).replace(/\\/g, "/")}` });
  await sleep(1200);
  await send("Runtime.evaluate", {
    expression: "document.fonts.ready.then(() => true)",
    awaitPromise: true,
  });
  await sleep(400);

  const { data } = await send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  });

  await writeFile(output, Buffer.from(data, "base64"));
  console.log(`Wrote ${output}`);
} finally {
  pageSocket?.close();
  browser.kill();
}

const http = require("http");
const os = require("os");
const fs = require("fs");

const PORT = 80;

function getIPAddresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const [name, entries] of Object.entries(interfaces)) {
        for (const entry of entries || []) {
            if (entry.family === "IPv4") {
                addresses.push(`${name}: ${entry.address}`);
            }
        }
    }

    return addresses.join("<br>") || "Unavailable";
}

function formatMB(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function getRows(data) {
    return Object.entries(data).map(([key, value]) => `
        <tr>
            <td>${key}</td>
            <td>${value}</td>
        </tr>
    `).join("");
}

function createTable(title, data) {
    return `
        <h2>${title}</h2>
        <table>
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                ${getRows(data)}
            </tbody>
        </table>
    `;
}

const server = http.createServer((req, res) => {

    const message = process.env.WEBTEXT || "Hello World!";
    const cpus = os.cpus();
    const memory = process.memoryUsage();
    const uptime = os.uptime();

    const application = {
        "Application Name": "webtext-app",
        "Application Status": "Running",
        "WEBTEXT": message,
        "Application Port": PORT,
        "Process ID": process.pid
    };

    const server = {
        "Hostname": os.hostname(),
        "Operating System": os.type(),
        "OS Release": os.release(),
        "Platform": os.platform(),
        "Architecture": os.arch(),
        "CPU Model": cpus[0]?.model || "Unknown",
        "CPU Cores": cpus.length,
        "IP Addresses": getIPAddresses(),
        "System Uptime": `${Math.floor(uptime / 3600)} hours ${Math.floor((uptime % 3600) / 60)} minutes`,
        "Load Average": os.loadavg().join(", ")
    };

    const memoryInfo = {
        "Total Memory": formatMB(os.totalmem()),
        "Free Memory": formatMB(os.freemem()),
        "Process RSS": formatMB(memory.rss),
        "Heap Used": formatMB(memory.heapUsed),
        "Heap Total": formatMB(memory.heapTotal),
        "External Memory": formatMB(memory.external)
    };

    const runtime = {
        "Node.js Version": process.version,
        "Node.js Executable": process.execPath,
        "Node Environment": process.env.NODE_ENV || "Not specified",
        "Process Uptime": `${Math.floor(process.uptime())} seconds`
    };

    const container = {
        "Docker Container": fs.existsSync("/.dockerenv") ? "Yes" : "Not detected",
        "Container Hostname": os.hostname(),
        "Container Architecture": os.arch()
    };

    const request = {
        "HTTP Method": req.method,
        "Request URL": req.url,
        "Client IP": req.socket.remoteAddress || "Unknown",
        "User Agent": req.headers["user-agent"] || "Unknown",
        "Request Time": new Date().toISOString()
    };

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>webtext-app | Server Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <style>
            body {
                margin: 0;
                padding: 30px;
                background: #111827;
                color: #f9fafb;
                font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
            }

            .container {
                max-width: 1100px;
                margin: auto;
            }

            header {
                background: #1f2937;
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 25px;
                border-left: 5px solid #22c55e;
            }

            h1 {
                color: #22c55e;
                margin-top: 0;
            }

            h2 {
                color: #60a5fa;
                margin-top: 30px;
                font-size: 20px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                background: #1f2937;
                border-radius: 8px;
                overflow: hidden;
            }

            th {
                background: #374151;
                color: #22c55e;
                text-align: left;
                padding: 13px;
            }

            td {
                padding: 12px;
                border-bottom: 1px solid #374151;
                overflow-wrap: anywhere;
            }

            tr:hover {
                background: #374151;
            }

            .status {
                color: #22c55e;
                font-weight: bold;
            }

            .message {
                font-size: 24px;
                color: #facc15;
                font-weight: bold;
            }

            footer {
                margin-top: 35px;
                color: #9ca3af;
                text-align: center;
            }

            @media(max-width: 600px) {
                body {
                    padding: 12px;
                }

                td, th {
                    padding: 9px;
                    font-size: 13px;
                }
            }
        </style>
    </head>

    <body>
        <div class="container">

            <header>
                <h1>WEBTEXT-APP</h1>
                <p class="status">● Application Running Successfully</p>
                <p>Message: <span class="message">${message.replace(/[&<>"']/g, c => ({
                    "&": "&amp;", "<": "&lt;", ">": "&gt;",
                    '"': "&quot;", "'": "&#39;"
                })[c])}</span></p>
                <p>DevOps Server Information Dashboard</p>
            </header>

            ${createTable("1. Application Information", application)}
            ${createTable("2. Server Information", server)}
            ${createTable("3. Memory Information", memoryInfo)}
            ${createTable("4. Node.js Runtime Information", runtime)}
            ${createTable("5. Docker Container Information", container)}
            ${createTable("6. HTTP Request Information", request)}

            <footer>
                webtext-app | Docker | Node.js | Amazon Linux |
                Last updated: ${new Date().toLocaleString()}
            </footer>

        </div>
    </body>
    </html>
    `;

    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });

    res.end(html);
});

server.listen(PORT, "0.0.0.0", () => {
    console.log("==================================");
    console.log("WEBTEXT-APP STARTED");
    console.log("Hostname:", os.hostname());
    console.log("Architecture:", os.arch());
    console.log("Operating System:", os.type());
    console.log("Node.js:", process.version);
    console.log("Port:", PORT);
    console.log("WEBTEXT:", process.env.WEBTEXT || "Hello World!");
    console.log("==================================");
});


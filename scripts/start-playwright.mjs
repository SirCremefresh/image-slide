import {exec as execCb, spawn} from 'child_process';
import http from 'http';

// Promise wrapper for exec
const exec = (command) => {
    return new Promise((resolve, reject) => {
        execCb(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({stdout, stderr});
        });
    });
};

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const sendLines = (str, action) => str.split('\n').map(l => l.trimEnd()).filter(l => l.length > 0).forEach(action);
const surroundLines = (str, prefix, suffix) => str.split('\n').map(l => l.trimEnd()).filter(l => l.length > 0).map(l => `${prefix}${l}${suffix}`).join('\n');

// Function to execute a command
const executeCommand = (command, args = [], stdoutAction, stderrAction) => {
    const process = spawn(command, args);

    process.stdout.on('data', data => sendLines(data?.toString(), stdoutAction));
    process.stderr.on('data', data => sendLines(data?.toString(), stderrAction));

    return process;
};

// Function to check if a site is reachable
const waitForServer = (url) => new Promise((resolve) => {
    const checkConnection = () => {
        http.get(url, (res) => {
            if (res.statusCode === 200) resolve();
            else setTimeout(() => {
                console.log("Waiting for server to be reachable...")
                checkConnection();
            }, 300);
        }).on('error', () => setTimeout(checkConnection, 300));
    };

    checkConnection();
});

const startPagesDevProcess = () => executeCommand(
    'npm',
    ['run', 'pages:dev'],
    (data) => console.log(`pages:dev stdout: "${data}"`),
    (data) => console.error(`pages:dev stderr: "${data}"`)
);

async function startAndRetryPagesDevProcess(retryCount = 0) {
    console.log(`Starting pages:dev process (retryCount: ${retryCount})`);
    const process = startPagesDevProcess();
    await sleep(1000);

    if (process.exitCode !== null) {
        process.kill("SIGINT");
        if (retryCount < 3) {
            await sleep(300);
            return await startAndRetryPagesDevProcess(retryCount + 1);
        } else {
            throw new Error(`pages:dev process exited with code ${process.exitCode}`);
        }
    }

    return process;

}

const pagesDevProcess = await startAndRetryPagesDevProcess();


// Wait for the server to be reachable
console.log('Waiting for server to be reachable...');
await waitForServer('http://localhost:8788');
console.log('Server is reachable.');

// Execute the second command
let success = false;
try {
    console.log('Running playwright test');
    const {stdout, stderr} = await exec(`npm run e2e:test`);
    console.log(surroundLines(stdout, 'playwright test stdout: "', '"'));
    console.error(surroundLines(stderr, 'playwright test stderr: "', '"'));
    success = true;
} catch (error) {
    console.error(`playwright test exec error: "${error}"`);
}

console.log('Terminating pages:dev process');
pagesDevProcess.kill("SIGINT");
console.log('Terminated pages:dev process');

process.exit(success ? 0 : 1);

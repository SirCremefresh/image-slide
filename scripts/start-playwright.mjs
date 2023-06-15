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
const TEST_TYPES = ['e2e', 'ct'];

const validateTestType = (testType) => {
    if (!TEST_TYPES.includes(testType)) {
        console.error(`Invalid test type "${testType}". Valid test types are: ${TEST_TYPES.join(', ')}`);
        process.exit(1);
    }
};

// Execute the first command
const pagesDevProcess = executeCommand(
    'npm',
    ['run', 'pages:dev'],
    (data) => console.log(`pages:dev stdout: "${data}"`),
    (data) => console.error(`pages:dev stderr: "${data}"`)
);
await sleep(1000)

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

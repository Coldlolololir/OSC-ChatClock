const osc = require("node-osc")
const humanize = require("humanize");
const { time } = require("console");
const exec = require('child_process').exec;
let client;

function setStatus(message) {
    client.send("/chatbox/input", [message, true, false], () => {console.log("Chatbox updated")})
}

const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

var funny = 1
var currentTime = "awaiting time..."
var previousClockM = "start"

setInterval(async () => {
    isRunning("VRChat.exe", async (running) => {
        if (running && client) {
            var clock24H = humanize.date("H")
            var clockM = humanize.date("i")
            var clock12H = humanize.date("h")
            var clock12Merdiam = humanize.date("A")

            if (previousClockM != clockM) {
                previousClockM =  clockM
                currentTime = `${clock12H == clock24H ? `${clock12H}:${clockM} ${clock12Merdiam}` : `${clock24H}:${clockM} | ${clock12H}:${clockM} ${clock12Merdiam}`}`
                setStatus(currentTime)
                console.log("Time updated")
            }
        }
    })
}, 100)

setInterval(async () => {
    isRunning("VRChat.exe", async (running) => {
        if (running) {
            if (!client) {
                client = new osc.Client("127.0.0.1", 9000);
                console.log("Connected to OSC")
            }
            setStatus(currentTime)   
        }
        else {
            if (client) {
                client.close();
            }
            client = null
        }
    })
}, 15000)



console.log("Script loaded and running")
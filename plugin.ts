const net = require('net')
const WebSocket = require('ws')
// import * as WebSocket from 'ws'
// import type WebSocket as smth from 'smth'


enum LogLevel {
    Nothing,
    Debug,
    Info
}
const logLevel = LogLevel.Debug

function log(msg: any, level: LogLevel = LogLevel.Debug) {
    if (logLevel <= level) {
        console.log(`cc-livesplit-one: ${msg}`)
    }
}

export default class CCLiveSplitOne {
    server: LiveSplitOneServer
    timerListener: CCTimerListener

    async prestart() {
        this.server = new LiveSplitOneServer()
        this.timerListener = new CCTimerListener(this.server)
        this.server.vars = this.timerListener

        this.server.startServer()
        this.timerListener.start()
    }

    async main() { }
}

class CCTimerListener {
    server: any
    port = 12346

    started: boolean = false
    connected: boolean = false
    split: boolean = false
    loading: boolean = true
    gameTime: number = 0

    constructor(public livesplitServer: LiveSplitOneServer) { }


    start() {
        this.server = new net.Server()
        this.server.on('connection', (client: any) => {
            log('connected to CCTimer, waiting for data')

            client.on('data', (data: Buffer) => {
                this.handleData(client, data)
            })
        
            client.on('close', () => {
                log('CCTimer disconnected');
            })
        
            client.on('error', (error: Error) => {
                console.error('cc-livesplit-one', error);
            })
        })

        this.server.listen(this.port)
    }

    handleData(client: any, data: Buffer) {
        if (! data) { return }
        const mode: number = data.at(0)!
        switch (mode - 48) {
            case 0:
                client.destroy();
                this.started = false;
                this.connected = false;

                log(`started: ${this.started}`, LogLevel.Debug)
                log(`connected: ${this.connected}`, LogLevel.Debug)
                break;
            case 1:
                this.started = true;
                this.livesplitServer.start()

                log(`started: ${this.started}`, LogLevel.Debug)
                break;
            case 2:
                this.split = true;
                this.livesplitServer.split()

                log(`split: ${this.split}`)
                break;
            case 3:
                this.gameTime = parseFloat(data.toString().substring(1));
                this.livesplitServer.setGameTime(this.gameTime)

                log(`gameTime: ${this.gameTime}`)
                break;
            case 4:
                if (!this.loading) {
                    this.loading = true;
                    this.livesplitServer.pauseGameTime()

                    log(`loading: ${this.loading}`, LogLevel.Debug)
                }
                break;
            case 5:
                if (this.loading) {
                    this.loading = false;
                    this.livesplitServer.resumeGameTime()
                    
                    log(`loading: ${this.loading}`, LogLevel.Debug)
                }
                break;
        }
    }
}

class LiveSplitOneServer {
    private server: any
    private wsList: Set<any>
    public vars: CCTimerListener

    constructor() { }

    startServer() {
        const host: string = 'localhost'
        const port: number = 5000

        this.server = new WebSocket.Server({ host, port });
        this.wsList = new Set();

        this.server.on('connection', (ws: any) => {
            this.wsList.add(ws);

            ws.on('close', () => {
                this.wsList.delete(ws);
            });
        });

        console.log(`Connect LiveSplitOne to ws://${host}:${port}`);
    }

    private sendCommand(name: string) {
        if (this.wsList) {
            for (const ws of Array.from(this.wsList)) {
                ws.send(name);
            }
        }
    }

    start() {
        this.reset();
        this.sendCommand("start");
    }

    split() {
        if (! this.vars.started) {
            this.start()
        }
        this.sendCommand("split");
    }

    reset() {
        this.sendCommand("reset");
    }

    tooglePause() {
        this.sendCommand("tooglepause");
    }

    undo() {
        this.sendCommand("undo");
    }

    skip() {
        this.sendCommand("skip")
    }

    initGameTime() {
        this.sendCommand("initgametime")
    }

    setGameTime(time: number) {
        this.sendCommand(`setgametime ${time}`)
    }

    setLoadingTimes(time: number) {
        this.sendCommand(`setloadingtimes ${time}`)
    }

    pauseGameTime() {
        this.sendCommand("pausegametime")
    }

    resumeGameTime() {
        this.sendCommand("resumegametime")
    }
}

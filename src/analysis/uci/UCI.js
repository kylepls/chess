import {parseUciInfoLine} from 'analysis/uci/UCIParser'

const debug = true

// based on https://github.com/ebemunk/node-uci/blob/7da2216b49ac1f575a042d033013a2ac09e1b650/src/Engine/index.js
export default class UCI {

    constructor(engine) {
        this.engine = engine
        this.pv = 3
        this.depth = 20
        this.queue = []
        this.working = false
    }

    _enqueue(jobFunction, name) {
        return new Promise(resolve => {
            this.queue.push(() => {
                if (debug) console.debug('start job', name)
                this.working = true

                jobFunction().then(v => {
                    resolve(v)
                    if (debug) console.debug('no longer working', name)
                    this.working = false
                    this._evalQueue()
                    return v
                })
            })
            this._evalQueue()
        })
    }

    _evalQueue() {
        if (!this.working && this.queue.length !== 0) {
            const jobFunction = this.queue.shift()
            this._setReceiver(undefined)
            jobFunction()
        }
    }

    _setReceiver(receiver) {
        this.engine.onmessage = ({data}) => {
            if (debug) console.debug('stockfish <=', data)
            if (receiver) receiver(data)
        }
    }

    _sendCommand(cmd) {
        if (debug) console.debug('stockfish =>', cmd)
        this.engine.postMessage(cmd)
    }

    async init(threads = 8, pv = 3, depth = 20) {
        this.pv = pv
        this.depth = 20
        await this._enqueue(() =>
                this._isReady()
                    .then(() => this._setOption('Threads', threads))
                    .then(() => this._setOption('MultiPv', pv)),
            'init',
        )
    }

    async _postMessageReadUntil(message, regex) {
        if (typeof regex === 'string') regex = new RegExp(regex)
        let buffer = ''

        const promise = new Promise((resolve) => {
            this._setReceiver(message => {
                buffer += `${message}\n`
                if (regex.test(message)) {
                    return resolve(buffer)
                }
            })
            this._sendCommand(message)
        }).catch(console.error)

        const timer = new Promise((_, reject) => {
            setTimeout(() => {
                reject(`timeout on command ${message}`)
            }, 5000)
        }).catch(() => {
        })

        return await Promise.race([promise, timer])
            .finally(() => {
                this._setReceiver(null)
            })
    }

    async _isReady() {
        await this._postMessageReadUntil('isready', 'readyok')
        return this
    }

    async _setOption(name, value) {
        await this._sendCommand(`setoption name ${name} value ${value}`)
        return this
    }

    async _setPosition(fen) {
        await this._sendCommand(`position fen ${fen}`)
        return this
    }

    async stop() {
        this.queue = []
        if (this.working) {
            if (debug) console.debug('stockfish stopping all jobs')
            this._sendCommand('stop')
            await this._enqueue(() => this._isReady(), 'stop')
        }
    }

    async go(fen, linesFunction, pv, depth) {
        const lines = Array(pv || this.pv)

        return await new Promise((resolve, reject) => {
            this._enqueue(() =>
                    this._isReady()
                        .then(() => new Promise((resolve2) => {
                            this._setPosition(fen)
                            this._setOption('MultiPv', pv || this.pv)
                            this._setReceiver(message => {
                                const info = parseUciInfoLine(message)
                                if (info.hasOwnProperty('bestMove')) {
                                    resolve2(lines)
                                    resolve(lines)
                                } else {
                                    lines[info.lineNumber - 1] = info
                                    linesFunction([...lines])
                                }
                            })

                            this._sendCommand(`go depth ${depth || this.depth}`)
                        })).catch(reject),
                'go',
            )
        })
    }

    /**
     * Obtain an evaluation for the current chess position
     */
    async eval(fen, depth = 8, scoreFunction = () => {
    }) {
        let cp = -1000
        const lineFunction = ([{score}]) => {
            cp = score
            scoreFunction(score)
        }

        // the stockfish eval function isn't that good, using the go function provides a much better estimate.
        // since this isn't critical lower depths are okay
        return this.go(fen, lineFunction, 1, depth)
            .then(() => cp)
    }
}


import {UCIRegexes} from "./UCIRegex";

// based on https://github.com/ebemunk/node-uci/blob/7da2216b49ac1f575a042d033013a2ac09e1b650/src/Engine/index.js
export default class UCI {

    constructor(engine) {
        this.engine = engine
    }

    setReceiver(receiver) {
        this.engine.onmessage = ({data}) => {
            if (!data.includes('info')) console.log(`<= ${data}`)
            if (receiver) receiver(data)
        }
    }

    sendCommand(cmd) {
        console.log(`=> ${cmd}`)
        this.engine.postMessage(cmd)
    }

    async postMessageReadUntil(message, regex) {
        if (typeof regex === 'string') regex = new RegExp(regex)
        let buffer = "";

        const promise = new Promise((resolve) => {
            this.setReceiver(message => {
                buffer += `${message}\n`;
                if (regex.test(message)) {
                    return resolve(buffer)
                }
            })
            this.sendCommand(message)
        });

        const timer = new Promise((_, reject) => {
            setTimeout(() => {
                reject(`timeout on command ${message}`)
            }, 5000)
        })

        return await Promise.race([promise, timer])
            .finally(() => {
                this.setReceiver(null)
            })
    }

    async isReady() {
        await this.postMessageReadUntil('isready', 'readyok')
        return this;
    }

    async setOption(name, value) {
        await this.sendCommand(`setoption name ${name} value ${value}`)
        await this.isReady()
        return this
    }

    async setPosition(fen) {
        await this.sendCommand(`position fen ${fen}`)
        await this.isReady()
        return this;
    }

    postStop() {
        this.setReceiver(null)
        this.sendCommand('stop')
    }

    async stop() {
        this.setReceiver(null)
        await this.sendCommand('stop')
    }

    async go(depth, linesCount, linesFunction) {
        await this.setOption('MultiPV', linesCount)

        const lines = Array(linesCount);

        return await new Promise(resolve => {
            this.setReceiver(message => {
                const info = parseInfo(message);
                if (info.hasOwnProperty('bestMove')) {
                    return resolve(message);
                } else {
                    lines[info.lineNumber-1] = info;
                    linesFunction([...lines])
                }
            })

            this.sendCommand(`go depth ${depth}`)
        }).finally(() => {
            this.setReceiver(null)
        })
    }

    /**
     * Obtain an evaluation for the current chess position
     */
    async eval() {
        await this.isReady()

        const evaluation = await this.postMessageReadUntil('eval', UCIRegexes.eval.evaluation)

        return {
            evaluation: extract(evaluation, UCIRegexes.eval.evaluation)
        }
    }
}

const extract = (line, regex) => {
    const matches = line.match(regex);
    return matches ? (matches.length === 2 ? matches[1] : matches.slice(1)) : null;
}

const parseInfo = data => {
    if (UCIRegexes.bestmove.test(data)) {
        return {bestMove: extract(data, UCIRegexes.bestmove)}
    }

    const lineNumber = extract(data, UCIRegexes.info.multipv) || 0;
    const depth = extract(data, UCIRegexes.info.depth);
    const nodes = extract(data, UCIRegexes.info.nodes) || 0;
    const [scoreType, scoreValue] = extract(data, UCIRegexes.info.score)
    // todo assume mate
    const score = scoreType === 'cp' ? parseInt(scoreValue) : `#${scoreValue}`
    const moves = extract(data, UCIRegexes.info.pv).split(' ')

    return {lineNumber, depth, nodes, score, moves}
}

import {UCIRegexes} from 'analysis/uci/UCIRegex'

export const parseUciInfoLine = data => {
    if (UCIRegexes.bestmove.test(data)) {
        return {bestMove: extract(data, UCIRegexes.bestmove)}
    }

    const lineNumber = extract(data, UCIRegexes.info.multipv) || 0
    const depth = extract(data, UCIRegexes.info.depth)
    const nodes = extract(data, UCIRegexes.info.nodes) || 0
    const [scoreType, scoreValue] = extract(data, UCIRegexes.info.score)
    // todo assume mate
    const score = scoreType === 'cp' ? parseInt(scoreValue) : `#${scoreValue}`
    const moves = extract(data, UCIRegexes.info.pv).split(' ')

    return {lineNumber, depth, nodes, score, moves}
}

export const parseUciEvalLine = data => {
    return ({
        evaluation: extract(data, UCIRegexes.eval.evaluation),
    })
}

const extract = (line, regex) => {
    const matches = line.match(regex)
    return matches ? (matches.length === 2 ? matches[1] : matches.slice(1)) : null
}


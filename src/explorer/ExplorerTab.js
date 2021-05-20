import {useBoardContext} from 'board/BoardContext'
import {Explorer} from 'explorer/Explorer'
import {MoveList} from 'moves/MoveList'
import React from 'react'
import {VerticalSplit} from 'utils/split/Splitter'

export const ExplorerTab = () => {

    const boardState = useBoardContext()
    const {displayFen} = boardState

    return (
        <VerticalSplit splits={[30, 70]}>
            <MoveList/>
            <Explorer fen={displayFen}/>
        </VerticalSplit>
    )
}

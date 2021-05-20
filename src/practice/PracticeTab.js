import {useBoardContext} from 'board/BoardContext'
import {Explorer} from 'explorer/Explorer'
import {MoveList} from 'moves/MoveList'
import {PGNSelector} from 'practice/pgn/PGNSelector'
import {usePracticeContext} from 'practice/PracticeContext'
import {PracticeController} from 'practice/PracticeController'
import {PracticeControls} from 'practice/PracticeControls'
import React from 'react'
import {VerticalSplit} from 'split/Splitter'

export const PracticeTab = () => {
    const practiceState = usePracticeContext()
    const {displayFen} = useBoardContext()

    return (
        <PracticeController>
            {practiceState.playing ?
                <VerticalSplit splits={[25, 65, 5]}>
                    <MoveList/>
                    <Explorer fen={displayFen}/>
                    <PracticeControls/>
                </VerticalSplit>
                :
                <VerticalSplit splits={[30, 60, 5]}>
                    <PGNSelector/>
                    <Explorer fen={displayFen}/>
                    <PracticeControls/>
                </VerticalSplit>
            }
        </PracticeController>
    )
}

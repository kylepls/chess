import {VerticalSplit} from "../split/Splitter";
import {MoveList} from "../moves/MoveList";
import React, {useContext} from "react";
import {PGNSelector} from "./pgn/PGNSelector";
import {Explorer} from "../explorer/Explorer";
import {PracticeControls} from "./PracticeControls";
import {PracticeContext} from "./PracticeContext";
import {PracticeController} from "./PracticeController";
import {BoardContext} from "../board/BoardContext";

export const PracticeTab = () => {
    const [practiceState] = useContext(PracticeContext);
    const [boardState] = useContext(BoardContext);

    const displayFen = boardState.boardChessjs.fen()

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
    );
}

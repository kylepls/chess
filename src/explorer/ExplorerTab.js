import {VerticalSplit} from "../split/Splitter";
import {MoveList} from "../moves/MoveList";
import {Explorer} from "./Explorer";
import React, {useContext} from "react";
import {BoardContext} from "../board/BoardContext";

export const ExplorerTab = () => {

    const [boardState] = useContext(BoardContext);
    const displayFen = boardState.boardChessjs.fen()

    return (
        <VerticalSplit splits={[30, 70]}>
            <MoveList/>
            <Explorer fen={displayFen}/>
        </VerticalSplit>
    )
}

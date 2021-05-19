import {VerticalSplit} from "../split/Splitter";
import {MoveList} from "../moves/MoveList";
import {Explorer} from "./Explorer";
import React from "react";
import {useBoardContext} from "../board/BoardContext";

export const ExplorerTab = () => {

    const boardState = useBoardContext()
    const displayFen = boardState.displayFen

    return (
        <VerticalSplit splits={[30, 70]}>
            <MoveList/>
            <Explorer fen={displayFen}/>
        </VerticalSplit>
    )
}

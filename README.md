# Chess Opening Thingy

[![Netlify Status](https://api.netlify.com/api/v1/badges/19dedc58-0c8a-4d40-a443-a03133004685/deploy-status)](https://app.netlify.com/sites/chess-thing/deploys)

### TL;DR

Training tool for Chess openings.


<a href="https://chess.kyle.in">
    <img src="https://i.imgur.com/WGWUvuv.png" alt="img"/>
</a>

[chess.kyle.in](https://chess.kyle.in)

### About

One of the most difficult parts of Chess is learning all the different openings. For the uninitiated, an opening is a
sequence of moves played at the beginning of the game that puts the player of the opening at an advantage. This means
that usually the player with the stronger opening knowledge will emerge from the first few moves of the game with an
advantage in material or position.

When I first started learning openings, I could not find a good way to go about the memorization process. Since the game
of Chess is always evolving, certain move orders move in and out of the Chess meta. For this reason, traditional opening
courses often leave the trainee unprepared for what they will encounter in their own games. This project strives to
bridge that gap. Using data gathered from [Lichess](https://lichess.org/) the player can practice playing openings in a
very realistic environment.

### How to use

There are 3 tabs _explorer_, _practice_, and _analysis_:

Explorer - Shows the moves for the current _game_ in the top part of the side panel. The bottom part of the side panel
allows you to see the most common moves with win percentages. Clicking an option in the sidebar or playing a move on the
board will update the view with the relevant data.

Practice - Study openings through weighted repetition. Initially, a list of openings will be displayed. You can hover
over the moves in the move list to see a preview of the board in that position. Openings can be filtered by playing the
starting moves on the board. Selecting an opening will present a play button. Clicking this will start the practice
simulation. For this, play the moves of the opening. The explorer portion of the sidebar will show your current
centi-pawn advantage along with possible next moves. When a line is completed, the simulation will reset and play a
likely different line.

Analysis - Use [Stockfish 11](https://stockfishchess.org/) to find the best moves in a position from a computer's
perspective. Each line will show an _optimal_ move list (hoverable) along with a pawn score.

### Tools / Links

* Openings - [365chess](https://www.365chess.com/eco.php) & [chess.com](https://chess.com)
* Explorer Data - [Lichess API](https://lichess.org/api#tag/Opening-Explorer)
* Chess Engine - [stockfish](https://stockfishchess.org/)
* UCI Protocol - [uci](http://wbec-ridderkerk.nl/html/UCIProtocol.html)
* Icons - [react-icons](https://react-icons.github.io/)
* Chess Board - [chessground](https://github.com/ornicar/chessground/)

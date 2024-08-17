import Pawn from "../Pieces/Pawn";
import Rook from "../Pieces/Rook";
import Knight from "../Pieces/Knight";
import Bishop from "../Pieces/Bishop";
import Queen from "../Pieces/Queen";
import King from "../Pieces/King";
import Piece from "../Pieces/Piece";

import ChessMatch from "../utils/ChessMatch";

import classes from "./Board.module.css";

import PlayerInfo from "./PlayerInfo";
import PromotionTooltip from "./PromotionTooltip";
import Clock from "./Clock";
import Popup from "./Popup";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { turnActions, movesActions, gamesActions } from "../store/index";

const CHESSMATCH = new ChessMatch();

const PAWN_A2 = new Pawn("w", { row: 6, column: 0 }, "p");
const PAWN_B2 = new Pawn("w", { row: 6, column: 1 }, "p");
const PAWN_C2 = new Pawn("w", { row: 6, column: 2 }, "p");
const PAWN_D2 = new Pawn("w", { row: 6, column: 3 }, "p");
const PAWN_E2 = new Pawn("w", { row: 6, column: 4 }, "p");
const PAWN_F2 = new Pawn("w", { row: 6, column: 5 }, "p");
const PAWN_G2 = new Pawn("w", { row: 6, column: 6 }, "p");
const PAWN_H2 = new Pawn("w", { row: 6, column: 7 }, "p");
const KNIGHT_B1 = new Knight("w", { row: 7, column: 1 }, "n");
const KNIGHT_G1 = new Knight("w", { row: 7, column: 6 }, "n");
const BISHOP_C1 = new Bishop("w", { row: 7, column: 2 }, "b");
const BISHOP_F1 = new Bishop("w", { row: 7, column: 5 }, "b");
const ROOK_A1 = new Rook("w", { row: 7, column: 0 }, "r");
const ROOK_H1 = new Rook("w", { row: 7, column: 7 }, "r");
const QUEEN_D1 = new Queen("w", { row: 7, column: 3 }, "q");
const KING_E1 = new King("w", { row: 7, column: 4 }, "k");

const PAWN_A7 = new Pawn("b", { row: 1, column: 0 }, "p");
const PAWN_B7 = new Pawn("b", { row: 1, column: 1 }, "p");
const PAWN_C7 = new Pawn("b", { row: 1, column: 2 }, "p");
const PAWN_D7 = new Pawn("b", { row: 1, column: 3 }, "p");
const PAWN_E7 = new Pawn("b", { row: 1, column: 4 }, "p");
const PAWN_F7 = new Pawn("b", { row: 1, column: 5 }, "p");
const PAWN_G7 = new Pawn("b", { row: 1, column: 6 }, "p");
const PAWN_H7 = new Pawn("b", { row: 1, column: 7 }, "p");
const KNIGHT_G8 = new Knight("b", { row: 0, column: 6 }, "n");
const KNIGHT_B8 = new Knight("b", { row: 0, column: 1 }, "n");
const BISHOP_C8 = new Bishop("b", { row: 0, column: 2 }, "b");
const BISHOP_F8 = new Bishop("b", { row: 0, column: 5 }, "b");
const ROOK_A8 = new Rook("b", { row: 0, column: 0 }, "r");
const ROOK_H8 = new Rook("b", { row: 0, column: 7 }, "r");
const QUEEN_D8 = new Queen("b", { row: 0, column: 3 }, "q");
const KING_E8 = new King("b", { row: 0, column: 4 }, "k");

const BOARD_INITIAL = [
  [
    ROOK_A8,
    KNIGHT_B8,
    BISHOP_C8,
    QUEEN_D8,
    KING_E8,
    BISHOP_F8,
    KNIGHT_G8,
    ROOK_H8,
  ],
  [PAWN_A7, PAWN_B7, PAWN_C7, PAWN_D7, PAWN_E7, PAWN_F7, PAWN_G7, PAWN_H7],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [PAWN_A2, PAWN_B2, PAWN_C2, PAWN_D2, PAWN_E2, PAWN_F2, PAWN_G2, PAWN_H2],
  [
    ROOK_A1,
    KNIGHT_B1,
    BISHOP_C1,
    QUEEN_D1,
    KING_E1,
    BISHOP_F1,
    KNIGHT_G1,
    ROOK_H1,
  ],
];

const PIECES_WITH_MARKED_MOVEMENT = ["k", "p", "r"];

const PAWNS = [
  PAWN_A2,
  PAWN_B2,
  PAWN_C2,
  PAWN_D2,
  PAWN_E2,
  PAWN_F2,
  PAWN_G2,
  PAWN_H2,
  PAWN_A7,
  PAWN_B7,
  PAWN_C7,
  PAWN_D7,
  PAWN_E7,
  PAWN_F7,
  PAWN_G7,
  PAWN_H7,
];

function Board({ setMovesIdx, movesIdx }) {
  const [board, setBoard] = useState(BOARD_INITIAL);
  const [movingPiece, setMovingPiece] = useState(
    new Piece(null, { row: null, column: null })
  );
  const [promotingPiece, setPromotingPiece] = useState(null);
  const [popupMsg, setPopupMsg] = useState(null);
  const [moveState, setMoveState] = useState(null);
  const [highlightMove, setHighlightMove] = useState({ from: null, to: null });
  const [piecesTaken] = useState(CHESSMATCH.getPiecesTaken());

  const turn = useSelector((state) => state.turn.turn);
  const moves = useSelector((state) => state.moves.moves);
  const movesBtnsAction = useSelector((state) => state.movesBtns.action);

  const dispatch = useDispatch();

  const move = {
    piece: {
      color: null,
      position: {
        row: null,
        column: null,
      },
      type: null,
    },
    destination: {
      row: null,
      column: null,
    },
    pieceTaken: {
      color: null,
      type: null,
    },
    promoting: null,
    enPassant: false,
    isCastling: false,
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    notation: null,
  };

  //controls for the buttons that move through the moves
  useEffect(() => {
    if (movesBtnsAction.includes("begin")) {
      setHighlightMove(() => {
        return {
          from: null,
          to: null,
        };
      });

      resetBoard();
      setMovesIdx(() => -1);
    }

    if (movesBtnsAction.includes("back")) {
      if (movesIdx == -1) return;
      const currentMove = moves[movesIdx];
      const piece =
        board[currentMove.destination.row][currentMove.destination.column];

      let newBoard = [...board];

      newBoard = moveBackwards(
        piece,
        {
          row: currentMove.piece.position.row,
          column: currentMove.piece.position.column,
        },
        newBoard
      );

      if (movesIdx) {
        const previousMove = moves[movesIdx - 1];

        setHighlightMove(() => {
          return {
            from: `${previousMove.destination.row}.${previousMove.destination.column}`,
            to: `${previousMove.piece.position.row}.${previousMove.piece.position.column}`,
          };
        });
      }

      setMovesIdx((prev) => prev - 1);

      setBoard(() => newBoard);
    }

    if (movesBtnsAction.includes("forth")) {
      if (movesIdx + 1 == moves.length - 1) return;

      movesIdx = movesIdx + 1;

      const currentMove = moves[movesIdx];

      const piece =
        board[currentMove.piece.position.row][
          currentMove.piece.position.column
        ];

      let newBoard = [...board];

      newBoard = moveForth(
        piece,
        {
          row: currentMove.destination.row,
          column: currentMove.destination.column,
        },
        newBoard
      );

      setMovesIdx((prev) => prev + 1);

      setHighlightMove(() => {
        return {
          from: `${currentMove.piece.position.row}.${currentMove.piece.position.column}`,
          to: `${currentMove.destination.row}.${currentMove.destination.column}`,
        };
      });
      setBoard(() => newBoard);
    }

    if (movesBtnsAction.includes("end")) {
      if (movesIdx == moves.length - 1) return;

      let newBoard = [...board];

      let idx = movesIdx == -1 ? 0 : movesIdx;
      while (true) {
        movesIdx = idx;
        const currentMove = moves[idx];
        const piece =
          board[currentMove.piece.position.row][
            currentMove.piece.position.column
          ];

        newBoard = moveForth(
          piece,
          {
            row: currentMove.destination.row,
            column: currentMove.destination.column,
          },
          newBoard
        );

        idx++;
        if (!moves[idx].piece.color.length) {
          idx--;
          break;
        }
      }

      const currentMove = moves[idx];

      setMovesIdx(() => idx);
      setHighlightMove(() => {
        return {
          from: `${currentMove.piece.position.row}.${currentMove.piece.position.column}`,
          to: `${currentMove.destination.row}.${currentMove.destination.column}`,
        };
      });

      setBoard(() => newBoard);
    }
  }, [movesBtnsAction]);

  //show popup with result
  useEffect(() => {
    if (!turn && moves.length) {
      if (moves[moves.length - 1].notation == "1-0") {
        setPopupMsg(() => "White has won");
      } else if (moves[moves.length - 1].notation == "0-1") {
        setPopupMsg(() => "Black has won");
      } else {
        setPopupMsg(() => "Draw");
      }

      const date = new Date();

      dispatch(
        gamesActions.saveGame({
          result: moves[moves.length - 1].notation,
          moves: moves,
          date: `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`,
        })
      );

      setMovingPiece(() => new Piece(null, { row: null, column: null }));

      setMovesIdx(() => moves.length - 2);
    }
  }, [turn]);

  //reseting board
  useEffect(() => {
    if (!turn && !moves.length) {
      setPopupMsg(() => null);
      resetBoard();
      setHighlightMove(() => {
        return { from: null, to: null };
      });
    }
  }, [moves.length]);

  function resetBoard() {
    const BOARD_RESET = [
      [
        ROOK_A8,
        KNIGHT_B8,
        BISHOP_C8,
        QUEEN_D8,
        KING_E8,
        BISHOP_F8,
        KNIGHT_G8,
        ROOK_H8,
      ],
      [PAWN_A7, PAWN_B7, PAWN_C7, PAWN_D7, PAWN_E7, PAWN_F7, PAWN_G7, PAWN_H7],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [PAWN_A2, PAWN_B2, PAWN_C2, PAWN_D2, PAWN_E2, PAWN_F2, PAWN_G2, PAWN_H2],
      [
        ROOK_A1,
        KNIGHT_B1,
        BISHOP_C1,
        QUEEN_D1,
        KING_E1,
        BISHOP_F1,
        KNIGHT_G1,
        ROOK_H1,
      ],
    ];

    //reseting positions and hasMoved propriety;
    for (let i = 0; i < BOARD_RESET.length; i++) {
      BOARD_RESET[0][i].setPosition({ row: 0, column: i });
      BOARD_RESET[1][i].setPosition({ row: 1, column: i });
      BOARD_RESET[1][i].setHasMoved(false);
      BOARD_RESET[6][i].setPosition({ row: 6, column: i });
      BOARD_RESET[6][i].setHasMoved(false);
      BOARD_RESET[7][i].setPosition({ row: 7, column: i });
      if (i == 0 || i == 4) {
        BOARD_RESET[7][i].setHasMoved(false);
        BOARD_RESET[0][i].setHasMoved(false);
      }
    }

    setBoard(() => BOARD_RESET);
    piecesTaken.black = [];
    piecesTaken.white = [];
  }

  function moveForth(movingPiece, destination, newBoard) {
    const origin = {
      row: movingPiece.getPosition().row,
      column: movingPiece.getPosition().column,
    };

    newBoard[origin.row][origin.column] = null;
    newBoard[destination.row][destination.column] = movingPiece;

    //promoting
    if (moves[movesIdx].promoting) {
      const piecePromoting = moves[movesIdx].promoting;
      if (piecePromoting == "q") {
        newBoard[destination.row][destination.column] = new Queen(
          movingPiece.getColor(),
          { row: destination.row, column: destination.column },
          piecePromoting
        );
      }

      if (piecePromoting == "n") {
        newBoard[destination.row][destination.column] = new Knight(
          movingPiece.getColor(),
          { row: destination.row, column: destination.column },
          piecePromoting
        );
      }

      if (piecePromoting == "b") {
        newBoard[destination.row][destination.column] = new Bishop(
          movingPiece.getColor(),
          { row: destination.row, column: destination.column },
          piecePromoting
        );
      }

      if (piecePromoting == "r") {
        newBoard[destination.row][destination.column] = new Rook(
          movingPiece.getColor(),
          { row: destination.row, column: destination.column },
          piecePromoting
        );
      }
    }

    //checking for en passant
    if (moves[movesIdx].enPassant) {
      newBoard[origin.row][destination.column] = null;
    }

    //checking for castling and moving rooks
    if (moves[movesIdx].isCastling) {
      if (newBoard[destination.row][destination.column + 1]?.getType() == "r") {
        newBoard[destination.row][destination.column - 1] =
          newBoard[destination.row][destination.column + 1];
        newBoard[destination.row][destination.column + 1] = null;
      } else {
        newBoard[destination.row][destination.column + 1] =
          newBoard[destination.row][destination.column - 2];
        newBoard[destination.row][destination.column - 2] = null;
      }
    }

    //if a piece is taken, add to piecesTaken
    if (moves[movesIdx].pieceTaken.color) {
      const color = moves[movesIdx].pieceTaken.color == "w" ? "white" : "black";
      CHESSMATCH.setPiecesTaken(color, moves[movesIdx].pieceTaken.type);
    }

    //setting piece's new position
    if (!moves[movesIdx].promoting) {
      movingPiece.setPosition({
        row: destination.row,
        column: destination.column,
      });
    }
    return newBoard;
  }

  function moveBackwards(movingPiece, destination, newBoard) {
    const origin = {
      row: movingPiece.getPosition().row,
      column: movingPiece.getPosition().column,
    };

    newBoard[origin.row][origin.column] = null;
    newBoard[destination.row][destination.column] = movingPiece;

    //undoing promotion
    if (moves[movesIdx].promoting) {
      newBoard[destination.row][destination.column] = new Pawn(
        movingPiece.getColor(),
        {
          row: destination.row,
          column: destination.column,
        },
        "p"
      );
    }

    //undoing capture
    if (moves[movesIdx].pieceTaken.color) {
      const type = moves[movesIdx].pieceTaken.type;
      const color = moves[movesIdx].pieceTaken.color;
      if (type == "p") {
        if (!moves[movesIdx].enPassant) {
          newBoard[origin.row][origin.column] = new Pawn(
            color,
            { row: origin.row, column: origin.column },
            type
          );
        } else {
          newBoard[destination.row][origin.column] = new Pawn(
            color,
            { row: destination.row, column: origin.column },
            type
          );
        }
      }

      if (type == "b") {
        newBoard[origin.row][origin.column] = new Bishop(
          color,
          { row: origin.row, column: origin.column },
          type
        );
      }

      if (type == "n") {
        newBoard[origin.row][origin.column] = new Knight(
          color,
          { row: origin.row, column: origin.column },
          type
        );
      }

      if (type == "r") {
        newBoard[origin.row][origin.column] = new Rook(
          color,
          { row: origin.row, column: origin.column },
          type
        );
      }

      if (type == "q") {
        newBoard[origin.row][origin.column] = new Queen(
          color,
          { row: origin.row, column: origin.column },
          type
        );
      }
    }

    //checking for castling and moving rooks
    if (moves[movesIdx].isCastling) {
      if (destination.column + 2 == origin.column) {
        const rook = newBoard[origin.row][origin.column - 1];
        newBoard[origin.row][origin.column - 1] = null;
        newBoard[origin.row][origin.column + 1] = rook;
      } else {
        const rook = newBoard[origin.row][origin.column + 1];
        newBoard[origin.row][origin.column + 1] = null;
        newBoard[origin.row][origin.column - 2] = rook;
      }
    }

    //removing piece from piecesTaken
    if (moves[movesIdx].pieceTaken.color) {
      const type = moves[movesIdx].pieceTaken.type;
      const color = moves[movesIdx].pieceTaken.color == "w" ? "white" : "black";
      const piecesTaken = CHESSMATCH.getPiecesTaken()[color];

      for (let i = 0; i < piecesTaken.length; i++) {
        if (piecesTaken[i].piece == type) {
          piecesTaken.splice(i, 1);
          break;
        }
      }

      CHESSMATCH.overwritePiecesTaken(color, piecesTaken);
    }

    if (!moves[movesIdx].promoting) {
      movingPiece.setPosition({
        row: destination.row,
        column: destination.column,
      });
    }
    return newBoard;
  }

  function movePiece(piece, caseCoords) {
    if (movingPiece.getPosition().row == null && !piece) return;

    //saving piece selected on first click
    //chages selected piece if you have already selected a piece of your color
    //and select of the same color
    if (
      (movingPiece.getPosition().row == null && piece) ||
      movingPiece.getColor() == piece?.getColor()
    ) {
      if (piece.getColor() !== turn) return;
      const { row, column } = piece.getPosition();
      setHighlightMove(() => {
        return { from: `${row}.${column}`, to: null };
      });
      setMovingPiece(() => piece);
      return;
    }

    //getting the case coordinates of the second click
    const coords = caseCoords.split(".").map((c) => +c);

    const newBoard = [...board];

    //gets all possible moves for the piece and checks if the one made
    //is one of them
    const possibleMoves =
      board[movingPiece.getPosition().row][
        movingPiece.getPosition().column
      ].possibleMoves(newBoard);

    let moveIsValid = false;

    for (let i = 0; i < possibleMoves.length; i++) {
      if (
        possibleMoves[i].row == coords[0] &&
        possibleMoves[i].column == coords[1]
      ) {
        moveIsValid = true;
        break;
      }
    }

    if (moveIsValid) {
      let pieceTaken, kingCoords;

      //making the move on the board to check if the king will not be in check
      //after it
      newBoard[movingPiece.getPosition().row][
        movingPiece.getPosition().column
      ] = null;
      if (newBoard[coords[0]][coords[1]]) {
        pieceTaken = newBoard[coords[0]][coords[1]];

        move.pieceTaken.color = pieceTaken.getColor();
        move.pieceTaken.type = pieceTaken.getType();
      }
      newBoard[coords[0]][coords[1]] = movingPiece;

      //checking for en passant
      if (
        !pieceTaken &&
        movingPiece.getType() == "p" &&
        movingPiece.getPosition().column != coords[1]
      ) {
        pieceTaken = newBoard[movingPiece.getPosition().row][coords[1]];
        newBoard[movingPiece.getPosition().row][coords[1]] = null;

        move.pieceTaken.color = pieceTaken.getColor();
        move.pieceTaken.type = pieceTaken.getType();
        move.enPassant = true;
      }

      //checking for castling and moving rooks
      if (
        movingPiece.getType() == "k" &&
        (coords[1] == movingPiece.getPosition().column - 2 ||
          coords[1] == movingPiece.getPosition().column + 2)
      ) {
        move.isCastling = true;

        if (newBoard[coords[0]][coords[1] + 1]?.getType() == "r") {
          newBoard[coords[0]][coords[1] - 1] =
            newBoard[coords[0]][coords[1] + 1];
          newBoard[coords[0]][coords[1] + 1] = null;
        } else {
          newBoard[coords[0]][coords[1] + 1] =
            newBoard[coords[0]][coords[1] - 2];
          newBoard[coords[0]][coords[1] - 2] = null;
        }
      }

      move.piece.color = movingPiece.getColor();
      move.piece.position = movingPiece.getPosition();
      move.piece.type = movingPiece.getType();
      move.destination.row = coords[0];
      move.destination.column = coords[1];

      //if king is moving, update it's position since it is needed to check if it is
      //in check or not, save the old one to undo the movement if not possible
      if (movingPiece.getType() == "k") {
        kingCoords = movingPiece.getPosition();
        movingPiece.setPosition({ row: +coords[0], column: +coords[1] });
      }

      //checks if king is in check after move is done
      const piecesChecking = CHESSMATCH.canPieceBeTaken(
        newBoard,
        turn == "w" ? KING_E1 : KING_E8
      );

      //if yes, then undo all changes
      if (piecesChecking.length) {
        if (kingCoords) movingPiece.setPosition(kingCoords);
        setMovingPiece(() => new Piece(null, { row: null, column: null }));
        setHighlightMove(() => {
          return { from: null, to: null };
        });
        return;
      }

      //saves piece taken
      if (pieceTaken) {
        const color = pieceTaken.getColor() == "w" ? "white" : "black";
        CHESSMATCH.setPiecesTaken(color, pieceTaken.getType());
      }

      //checks if the move is a promotion
      if (movingPiece.getType() == "p" && (coords[0] == 0 || coords[0] == 7)) {
        setPromotingPiece(() => `${coords[0]}.${coords[1]}`);
        movingPiece.setPosition({ row: +coords[0], column: +coords[1] });
        setMoveState(() => move);
        return;
      }

      //if piece is a king, rook or pawn and it has not moved yet, mark
      // its 'hasMoved' propriety as true
      if (
        PIECES_WITH_MARKED_MOVEMENT.includes(movingPiece.getType()) &&
        !movingPiece.getHasMoved()
      ) {
        movingPiece.setHasMoved(true);
      }

      //if it is a pawn and it just moved two cases, mark it as valid for en passant capture
      if (
        movingPiece.getType() == "p" &&
        (coords[0] - 2 == 1 || coords[0] + 2 == 6)
      ) {
        movingPiece.setEnPassant(true);
      }

      setHighlightMove((prevState) => {
        return { from: prevState.from, to: `${coords[0]}.${coords[1]}` };
      });
      movingPiece.setPosition({ row: coords[0], column: coords[1] });

      setBoard(() => newBoard);

      //checking it the move made threatens the opponent king
      const isCheckmateOrDraw = checkmateOrDraw(newBoard);

      if (isCheckmateOrDraw) return;

      dispatch(movesActions.pushAMove(move));
      dispatch(turnActions.setTurn(movingPiece.getColor() == "w" ? "b" : "w"));
    }

    //loops through all the pawns and unmarks those set to be possible
    //for en passant capture (unless it just got marked as such)
    PAWNS.forEach((pawn) => {
      if (pawn != movingPiece && pawn.getEnPassant()) {
        pawn.setEnPassant(false);
      }
    });

    setMovingPiece(new Piece(null, { row: null, column: null }));
  }

  function checkmateOrDraw(newBoard) {
    const piecesChecking = CHESSMATCH.canPieceBeTaken(
      newBoard,
      turn == "w" ? KING_E8 : KING_E1
    );

    if (piecesChecking.length) {
      move.isCheck = true;

      //if so, check for a checkmate
      const isItCheckmate = CHESSMATCH.isItCheckmate(
        newBoard,
        piecesChecking,
        turn == "w" ? KING_E8 : KING_E1
      );

      if (isItCheckmate) {
        move.isCheckmate = true;
        dispatch(turnActions.setTurn(null));
        dispatch(movesActions.pushAMove(move));
        setMovingPiece(new Piece(null, { row: null, column: null }));
        return true;
      }
    } else {
      //if not, check for a draw
      const isItDrawn = CHESSMATCH.isItDraw(
        newBoard,
        turn == "w" ? KING_E8 : KING_E1
      );

      if (isItDrawn) {
        move.isDraw = true;
        dispatch(turnActions.setTurn(null));
        dispatch(movesActions.pushAMove(move));
        setMovingPiece(new Piece(null, { row: null, column: null }));
        return true;
      }
    }
    return false;
  }

  function promotePiece(piece) {
    const move = moveState;
    move.promoting = piece.getType();

    //sets position of the newly created piece;
    piece.setPosition(movingPiece.getPosition());
    const newBoard = [...board];
    newBoard[movingPiece.getPosition().row][movingPiece.getPosition().column] =
      piece;
    //saving board ans reseting state
    setBoard(() => newBoard);
    setPromotingPiece(() => null);
    setMovingPiece(() => new Piece(null, { row: null, column: null }));

    //checking for chemate or draw now that the move is made
    if (checkmateOrDraw(newBoard)) return;

    //loops through all the pawns and unmarks those set to be possible
    //for en passant capture
    PAWNS.forEach((pawn) => {
      if (pawn != movingPiece && pawn.getEnPassant()) {
        pawn.setEnPassant(false);
      }
    });

    dispatch(movesActions.pushAMove(move));
    dispatch(turnActions.setTurn(movingPiece.getColor() == "w" ? "b" : "w"));
  }

  return (
    <div>
      <div className={classes["player__header"]}>
        <Clock key={"b"} color={"b"}></Clock>
        <PlayerInfo piecesTaken={piecesTaken.white} color={"w"}></PlayerInfo>
      </div>
      <div className={classes["board__grid"]}>
        {popupMsg && (
          <Popup message={popupMsg} closePopup={setPopupMsg}></Popup>
        )}
        {board.map((row, idxRow) => {
          return row.map((piece, idxCol) => {
            let pieceClass;
            if (piece) pieceClass = piece.getColor() + piece.getType();
            const colorCase = (idxRow + idxCol) % 2 == 0;
            return (
              <div
                className={`${pieceClass ? pieceClass : ""}
                 ${colorCase ? classes["light"] : classes["dark"]}
                  ${idxRow == 0 || idxRow == 7 ? classes["relative"] : ""} 
                ${
                  highlightMove.to == `${idxRow}.${idxCol}` &&
                  classes["highlight__case"]
                }
                 ${
                   highlightMove.from == `${idxRow}.${idxCol}` &&
                   classes["highlight__case"]
                 }`}
                key={`${idxRow}${idxCol}`}
                id={`${idxRow}.${idxCol}`}
                onClick={(e) => movePiece(piece, e.target.id)}
              >
                {idxRow == 0 && promotingPiece == `${idxRow}.${idxCol}` ? (
                  <PromotionTooltip color={"w"} promote={promotePiece} />
                ) : (
                  ""
                )}
                {idxRow == 7 && promotingPiece == `${idxRow}.${idxCol}` ? (
                  <PromotionTooltip color={"b"} promote={promotePiece} />
                ) : (
                  ""
                )}
              </div>
            );
          });
        })}
      </div>
      <div className={classes["player__header"]}>
        <Clock key={"w"} color={"w"}></Clock>
        <PlayerInfo piecesTaken={piecesTaken.black} color={"b"}></PlayerInfo>
      </div>
    </div>
  );
}

export default Board;

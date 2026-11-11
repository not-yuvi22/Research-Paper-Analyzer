import { useEffect, useMemo, useState } from "react";

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export default function LoadingTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));

  const winner = useMemo(() => {
    for (const [a,b,c] of wins) {
      if (
        board[a] &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        return board[a];
      }
    }
    return null;
  }, [board]);

  const isDraw =
    !winner && board.every((cell) => cell !== "");

  // Computer plays X
  useEffect(() => {
    if (winner || isDraw) return;

    const xCount = board.filter((x) => x === "X").length;
    const oCount = board.filter((x) => x === "O").length;

    // AI's turn
    if (xCount === oCount) {
      const timer = setTimeout(() => {
        const empty = board
          .map((v, i) => (v === "" ? i : null))
          .filter((v) => v !== null) as number[];

        if (!empty.length) return;

        const random =
          empty[Math.floor(Math.random() * empty.length)];

        const copy = [...board];
        copy[random] = "X";
        setBoard(copy);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [board, winner, isDraw]);

  // Player plays O
  const handleClick = (index: number) => {
    if (board[index]) return;
    if (winner || isDraw) return;

    const xCount = board.filter((x) => x === "X").length;
    const oCount = board.filter((x) => x === "O").length;

    // Only allow move after AI
    if (xCount !== oCount + 1) return;

    const copy = [...board];
    copy[index] = "O";
    setBoard(copy);
  };

  const reset = () => {
    setBoard(Array(9).fill(""));
  };

  return (
    <div className="mt-8 flex flex-col items-center">

      <p className="mb-4 text-xs opacity-70 text-center">
        Beat the AI while your paper uploads 🤖
      </p>

      <div className="grid grid-cols-3 gap-2">

        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="
              w-16
              h-16
              border-2
              border-white
              text-2xl
              font-bold
              hover:bg-white/10
              transition
            "
          >
            {cell}
          </button>
        ))}

      </div>

      {winner && (
        <p className="mt-4 font-bold text-lg">
          {winner === "X"
            ? "AI Wins 🤖"
            : "You Win 🎉"}
        </p>
      )}

      {isDraw && (
        <p className="mt-4 font-bold">
          Draw 🤝
        </p>
      )}

      <button
        onClick={reset}
        className="
          mt-4
          rounded
          border
          px-4
          py-2
          hover:bg-white/10
        "
      >
        Play Again
      </button>
    </div>
  );
}
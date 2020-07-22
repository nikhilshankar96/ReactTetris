import React, { useState } from "react";

import { createStage, checkCollision } from "../gameHelpers";

import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useInterval } from "../hooks/useInterval";
import { useGameStatus } from "../hooks/useGameStatus";

// Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import { StyledTetrisWrapper, StyledTetris } from "./styles/StyledTetris";

// const dropTimeInt = 1000;

const Tetris = () => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);

	const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
	const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);

	const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
		rowsCleared
	);

	// console.log("re-render event");

	const movePlayer = (direction) => {
		if (!checkCollision(player, stage, { x: direction, y: 0 }))
			updatePlayerPos({ x: direction, y: 0 });
	};

	const startGame = () => {
		setStage(createStage());
		setGameOver(false);
		setDropTime(1000);
		resetPlayer();
		setScore(0);
		setRows(0);
		setLevel(0);
	};

	const drop = () => {
		if (rows > (level + 1) * 10) {
			setLevel((prev) => prev + 1);
			setDropTime(1000 / (level + 1) + 200);
		}

		if (!checkCollision(player, stage, { x: 0, y: 1 }))
			updatePlayerPos({ x: 0, y: 1, collided: false });
		else {
			if (player.pos.y < 1) {
				console.log("Game over!");
				setGameOver(true);
				setDropTime(null);
			}
			updatePlayerPos({ x: 0, y: 0, collided: true });
		}
	};

	const keyUp = ({ keyCode }) => {
		if (!gameOver)
			if (keyCode === 40) {
				setDropTime(1000 / (level + 1) + 200);
				console.log("enable auto drop");
			}
	};

	const dropPlayer = () => {
		console.log("disable auto drop");
		setDropTime(null);
		drop();
	};

	const move = ({ keyCode }) => {
		if (!gameOver) {
			if (keyCode === 37) movePlayer(-1);
			if (keyCode === 39) movePlayer(1);
			if (keyCode === 40) dropPlayer();
			if (keyCode === 38) playerRotate(stage, 1);
		}
	};

	useInterval(() => {
		drop();
	}, dropTime);

	return (
		<StyledTetrisWrapper
			role='button'
			tabIndex='0'
			onKeyDown={(e) => move(e)}
			onKeyUp={keyUp}
		>
			<StyledTetris>
				<Stage stage={stage} />
				<aside>
					{gameOver ? (
						<Display gameOver={gameOver} text='Game over!' />
					) : (
						<div>
							<Display text={`Score: ${score}`} />
							<Display text={`Rows: ${rows}`} />
							<Display text={`Level: ${level}`} />
						</div>
					)}
					<StartButton callback={startGame} />
				</aside>
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;

import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import Worm from "./worm";
import styled from "styled-components";
library.add(faCoffee);

const Cell = styled.div`
  width: 16px;
  height: 16px;
  background-color: grey;
`;
const Main = styled.div`
  width: 500px;
`;

const Screen = styled.div`
  display: grid;
  grid-template-columns: auto auto;
`;

const Stats = styled.div`
  display: grid;
  grid-template-rows: repeat(16, 16px);
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(16, 16px);
  grid-gap: 1px;
`;

const board = [];
const boardRefs = [];
const xSize = 16;
const ySize = 16;
let key = 0;
for (let y = 0; y < ySize; y++) {
  for (let x = 0; x < xSize; x++) {
    let ref = React.createRef();
    board.push(React.createElement(Cell, { x, y, key, ref }));
    boardRefs.push(ref);
    key++;
  }
}

const worm = new Worm();

function useInterval(callback, delay, stop = false) {
  const saveCallback = useRef();
  const [intervalState, setIntervalState] = useState();

  useEffect(() => {
    saveCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      saveCallback.current();
    }

    let intervalId = setInterval(tick, delay);
    setIntervalState(intervalId);
    return () => clearInterval(intervalId);
  }, [delay]);

  useEffect(() => {
    if (stop === true) {
      clearInterval(intervalState);
    }
  }, [stop, intervalState]);
}

export default function App() {
  console.log(worm);
  const inputRef = React.createRef();
  const [lastMove, setLastMove] = useState("moveRight");
  const [playState, setPlayState] = useState("ready");
  const [wormLocation, setWormLocation] = useState({});

  useInterval(
    () => {
      worm[lastMove].call(worm);
      let { head, length } = worm;
      let prev;
      setWormLocation({ x: head.x, y: head.y });
      let segmentCounter = 0;
      while (head) {
        let { x, y, next } = head;
        x = x || 1;
        y = y || 1;
        if (x > xSize - 1 || x < 1 || y < 1 || y > ySize - 1) {
          setPlayState("stop");
          break;
        } else {
          let color = segmentCounter < length ? "red" : "grey";
          boardRefs[x + y * xSize].current.style.backgroundColor = color;
          if (color === "grey") {
            prev.next = null;
          }
          prev = head;
          head = next;

          segmentCounter++;
        }
      }
    },
    400,
    playState === "stop"
  );

  const handleKeyDown = (event) => {
    console.log("key", event.key);
    let newMove;
    switch (event.key) {
      case "ArrowLeft":
        newMove = "moveLeft";
        break;
      case "ArrowUp":
        newMove = "moveUp";
        break;
      case "ArrowDown":
        newMove = "moveDown";
        break;
      default:
        newMove = "moveRight";
        break;
    }
    worm.add(worm.head.x, worm.head.y);
    worm.setLength(worm.getLength() + 1);
    console.log(newMove);
    setLastMove(newMove);
  };

  return (
    <div className="App">
      <Main>
        <Screen>
          <Board>{board}</Board>
          <Stats>
            <div>
              {wormLocation.x},{wormLocation.y}
            </div>
            <div>{lastMove}</div>
            <div>{playState}</div>
            <div>
              <input ref={inputRef} type="text" onKeyDown={handleKeyDown} />
            </div>
          </Stats>
        </Screen>
      </Main>
    </div>
  );
}

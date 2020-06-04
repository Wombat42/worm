import React, { useEffect, useState } from "react";
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
const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(16, 16px);
  grid-gap: 1px;
`;

const board = [];
const boardRefs = [];
let key = 0;
for (let y = 0; y < 16; y++) {
  for (let x = 0; x < 16; x++) {
    let ref = React.createRef();
    board.push(React.createElement(Cell, { x, y, key, ref }));
    boardRefs.push(ref);
    key++;
  }
}

const worm = new Worm();

export default function App() {
  debugger;
  const [lastMove, setLastMove] = useState(worm.moveRight);
  useEffect(() => {
    console.log(board);
    //setInterval(() => {
    // move worm
    lastMove.call(worm);
    // }, 2000);
  }, [lastMove]);

  return (
    <div className="App">
      <Board>{board}</Board>
    </div>
  );
}

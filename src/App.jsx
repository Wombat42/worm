import React, { useEffect, useState, useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Worm from './worm';
import theme from './theme';

library.add(faCoffee);

const Cell = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.theme.board.background};
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
  grid-template-rows: repeat(32, 16px);
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(32, 16px);
`;

const board = [];
const boardRefs = [];
const xSize = 32;
const ySize = 32;
let key = 0;
for (let y = 0; y < ySize; y++) {
  for (let x = 0; x < xSize; x++) {
    const ref = React.createRef();
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

    const intervalId = setInterval(tick, delay);
    setIntervalState(intervalId);
    return () => clearInterval(intervalId);
  }, [delay]);

  useEffect(() => {
    if (stop === true) {
      clearInterval(intervalState);
    }
  }, [stop, intervalState]);
}

function App() {
  console.log(worm);
  const inputRef = React.createRef();
  const [lastMove, setLastMove] = useState('moveRight');
  const [playState, setPlayState] = useState('ready');
  const [wormLocation, setWormLocation] = useState({});

  useInterval(
    () => {
      console.log(inputRef);
      worm[lastMove].call(worm);
      const { length } = worm;
      let { head } = worm;
      let prev;
      setWormLocation({ x: head.x, y: head.y });
      let segmentCounter = 0;
      while (head) {
        const { next, x, y } = head;
        if (x > xSize - 1 || x < 0 || y < 0 || y > ySize - 1) {
          setPlayState('stop');
          break;
        } else {
          const color =
            segmentCounter < length
              ? theme.board.caterpillar
              : theme.board.background;
          boardRefs[
            x + y * xSize
          ].current.style.backgroundColor = color;
          if (color === theme.board.background) {
            prev.next = null;
          }
          prev = head;
          head = next;

          segmentCounter++;
        }
      }
    },
    400,
    playState === 'stop',
  );

  const handleKeyDown = (event) => {
    console.log('key', event.key);
    let newMove;
    switch (event.key) {
      case 'ArrowLeft':
        newMove = 'moveLeft';
        break;
      case 'ArrowUp':
        newMove = 'moveUp';
        break;
      case 'ArrowDown':
        newMove = 'moveDown';
        break;
      default:
        newMove = 'moveRight';
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
              <input
                ref={inputRef}
                type="text"
                autoFocus
                onKeyDown={handleKeyDown}
              />
            </div>
          </Stats>
        </Screen>
      </Main>
    </div>
  );
}

export default hot(App);

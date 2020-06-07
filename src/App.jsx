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

let board;
let boardRefs;
const xSize = 32;
const ySize = 32;
let worm = null;

function setup() {
  worm = new Worm();
  board = [];
  boardRefs = [];
  let key = 0;
  for (let y = 0; y < ySize; y++) {
    for (let x = 0; x < xSize; x++) {
      const ref = React.createRef();
      board.push(React.createElement(Cell, { x, y, key, ref }));
      boardRefs.push(ref);
      key++;
    }
  }
}

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
  const inputRef = React.createRef();
  const [lastMove, setLastMove] = useState('moveRight');
  const [playState, setPlayState] = useState('init');
  const [wormLocation, setWormLocation] = useState({});

  useEffect(() => {
    if (playState === 'init') {
      setup();
      setPlayState('running');
    }
  }, [playState]);

  useInterval(
    () => {
      if (playState === 'running') {
        console.log(inputRef);
        if (inputRef.current) {
          inputRef.current.focus();
        }
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
    if (newMove !== lastMove) {
      worm.grow(3);
      console.log(newMove);
      setLastMove(newMove);
    }
  };

  const handleReset = () => {
    setPlayState('init');
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
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <button type="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </Stats>
        </Screen>
      </Main>
    </div>
  );
}

export default hot(App);

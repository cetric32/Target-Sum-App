import React, {useState} from 'react';
import Game from './src/components/Game';

const App = () => {
  const [gameId, setGameId] = useState(1);

  const resetGame = () => {
    setGameId(prevId => prevId + 1);
  };

  return (
    <>
      <Game
        key={gameId}
        onPlayAgain={resetGame}
        randomNumberCount={6}
        initialSeconds={10}
      />
    </>
  );
};

export default App;

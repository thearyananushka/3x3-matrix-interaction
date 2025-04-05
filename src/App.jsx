
import { useState, useRef } from "react";
import styled from "styled-components";
import clickSoundFile from "./assets/click.mp3";
import transitionSoundFile from "./assets/transition.mp3";
import resetSoundFile from "./assets/reset.mp3"; // ⬅️ NEW

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 10px;
  margin-bottom: 30px;
`;

const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.color};
  border: 2px solid #333;
  border-radius: 10px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "scale(1.05)")};
  }
`;

const ResetButton = styled.button`
  padding: 12px 30px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff5f6d, #ffc371);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 99, 71, 0.4);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 99, 71, 0.5);
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4px 10px rgba(255, 99, 71, 0.3);
  }
`;

function App() {
  const [grid, setGrid] = useState(Array(9).fill("white"));
  const [clickOrder, setClickOrder] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const clickSound = useRef(new Audio(clickSoundFile));
  const transitionSound = useRef(new Audio(transitionSoundFile));
  const resetSound = useRef(new Audio(resetSoundFile)); // ⬅️ NEW

  const handleClick = (index) => {
    if (grid[index] !== "white" || disabled) return;

    // Play click sound
    clickSound.current.currentTime = 0;
    clickSound.current.play();

    const updatedGrid = [...grid];
    updatedGrid[index] = "green";
    const newClickOrder = [...clickOrder, index];

    setGrid(updatedGrid);
    setClickOrder(newClickOrder);

    if (newClickOrder.length === 9) {
      setDisabled(true);

      newClickOrder.forEach((idx, i) => {
        setTimeout(() => {
          // Play transition sound
          transitionSound.current.currentTime = 0;
          transitionSound.current.play();

          setGrid((prev) => {
            const newGrid = [...prev];
            newGrid[idx] = "orange";
            return newGrid;
          });
        }, i * 300);
      });
    }
  };

  const resetGame = () => {
    // Play reset sound
    resetSound.current.currentTime = 0;
    resetSound.current.play();

    setGrid(Array(9).fill("white"));
    setClickOrder([]);
    setDisabled(false);
  };

  return (
    <Wrapper>
      <Title>3x3 Matrix Color Interaction</Title>
      <Container>
        {grid.map((color, idx) => (
          <Box
            key={idx}
            color={color}
            onClick={() => handleClick(idx)}
            disabled={disabled}
          />
        ))}
      </Container>
      <ResetButton onClick={resetGame}>Reset</ResetButton>
    </Wrapper>
  );
}

export default App;

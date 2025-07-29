import React, { useRef, useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";

import image1 from "./images/1.jpeg";
import image2 from "./images/2.jpeg";
import image3 from "./images/3.jpeg";
import image4 from "./images/4.jpeg";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Zeyada&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-image: url("https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcm00NjdiYXRjaDUtc2NlbmUtdy0wMDItbDBha3pzejYuanBn.jpg");
  background-position: center;
  font-family: "Zeyada", cursive;
`;

const Paper = styled.div`
  position: absolute;
  background-image: url("https://i0.wp.com/textures.world/wp-content/uploads/2018/10/2-Millimeter-Paper-Background-copy.jpg?ssl=1");
  background-size: 500px;
  background-position: center;
  padding: 20px;
  box-shadow: 1px 15px 20px 0px rgba(0, 0, 0, 0.5);
  transform: rotate(${(props) => props.rotation}deg);
  cursor: grab;
  user-select: none;
  transition: transform 0.1s ease;

  &:active {
    cursor: grabbing;
  }

  &.cake {
    width: 200px;
    height: 200px;
    padding: 0;
    border-radius: 50%;
    position: relative;

    &::after {
      content: "";
      background-image: url("https://t4.ftcdn.net/jpg/05/60/56/11/360_F_560561125_zSy1VnDYeCKLXHjRs4BB5WI8FAFIU02e.jpg");
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: 150px;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.8;
      border-radius: 50%;
    }
  }
`;

const Image = styled.img`
  max-height: 200px;
  max-width: 100%;
  user-select: none;
  pointer-events: none;
`;

const Text = styled.p`
  font-size: ${(props) => (props.small ? "30px" : "50px")};
  color: rgb(0, 0, 100);
  opacity: 0.75;
  margin: 10px 0;
  filter: drop-shadow(2px 1.5px 1px rgba(0, 0, 105, 0.9));
  pointer-events: none;
`;

const DragPapers = () => {
  const [zIndex, setZIndex] = useState(1);
  const papers = useRef([]);
  const paperData = useRef([]);

  useEffect(() => {
    paperData.current = Array(papers.current.length)
      .fill()
      .map(() => ({
        x: 0,
        y: 0,
        rotation: Math.random() * 30 - 15,
        isDragging: false,
        startX: 0,
        startY: 0,
      }));
  }, []);

  const handleMouseDown = (index, e) => {
    if (e.button === 2) return;

    const paper = papers.current[index];
    paperData.current[index].isDragging = true;
    paperData.current[index].startX = e.clientX - paperData.current[index].x;
    paperData.current[index].startY = e.clientY - paperData.current[index].y;

    paper.style.zIndex = zIndex;
    setZIndex(zIndex + 1);
  };

  const handleMouseMove = (e) => {
    paperData.current.forEach((data, index) => {
      if (!data.isDragging) return;

      const paper = papers.current[index];
      data.x = e.clientX - data.startX;
      data.y = e.clientY - data.startY;

      paper.style.transform = `translate(${data.x}px, ${data.y}px) rotate(${data.rotation}deg)`;
    });
  };

  const handleMouseUp = () => {
    paperData.current.forEach((data) => {
      data.isDragging = false;
    });
  };

  const handleContextMenu = (index, e) => {
    e.preventDefault();
    const paper = papers.current[index];
    const rect = paper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle =
      (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;

    paperData.current[index].rotation = angle;
    paper.style.transform = `translate(${paperData.current[index].x}px, ${paperData.current[index].y}px) rotate(${angle}deg)`;

    paper.style.zIndex = zIndex;
    setZIndex(zIndex + 1);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>

        <Paper
          className="cake"
          ref={(el) => (papers.current[0] = el)}
          onMouseDown={(e) => handleMouseDown(0, e)}
          onContextMenu={(e) => handleContextMenu(0, e)}
          rotation={paperData.current[0]?.rotation || 0}
        />


        {[
          {
            content: (
              <>
                <Text small>
                  once Again wishing you
                  <br />A very Delightful
                  <br />
                  Happy Birthday
                </Text>
                <Image src={image2} alt="Birthday greeting" />
              </>
            ),
          },
          {
            content: (
              <>
                <Text small>
                  The more you smile the
                  <br />
                  more you desire your dreams
                </Text>
                <Image src={image1} alt="Smile encouragement" />
              </>
            ),
          },
          {
            content: <Image src={image3} alt="Additional birthday image" />,
          },
          {
            content: (
              <>
                <Text small>How can be</Text>
                <Text small>someone so cute ❤️</Text>
                <Image src={image4} alt="Cute compliment" />
              </>
            ),
          },
          {
            content: (
              <>
                <Text>Wish you a very</Text>
                <Text>
                  Happy Birthday <span style={{ color: "red" }}>❤️</span>
                </Text>
              </>
            ),
          },
          {
            content: (
              <>
                <Text>Drag the papers to move!</Text>
                <Text small>Right-click to rotate</Text>
              </>
            ),
          },
        ].map((paper, index) => (
          <Paper
            key={index}
            ref={(el) => (papers.current[index + 1] = el)}
            onMouseDown={(e) => handleMouseDown(index + 1, e)}
            onContextMenu={(e) => handleContextMenu(index + 1, e)}
            rotation={
              paperData.current[index + 1]?.rotation || Math.random() * 30 - 15
            }
            style={{
              padding: index === 2 ? "10px" : "20px",
              transform: `rotate(${
                paperData.current[index + 1]?.rotation ||
                Math.random() * 30 - 15
              }deg)`,
            }}
          >
            {paper.content}
          </Paper>
        ))}
      </Container>
    </>
  );
};

export default DragPapers;
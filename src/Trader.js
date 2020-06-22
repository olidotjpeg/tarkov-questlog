import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
  margin: 8px 0;
  width: 80px;
  height: 80px;
  img {
    width: 100%;
  }
  &:hover {
    img {
      box-shadow: 2px 2px 18px 0px rgba(255,255,255,1);
    }
  }
`;

export default ({ trader, select }) => {
  return (
    <Box onClick={() => select(trader)}>
      <img src={trader.avatar} alt={trader.name} />
    </Box>
  )
};

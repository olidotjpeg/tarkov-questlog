import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import './style.css';
import {UpdateQuest, AppStarter} from './QuestService';
import Trader from './Trader';
import QuestLog from './QuestLog';

const MainWrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

const TraderWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  color: #fff;
  width: 100px;
  height: 80vh;
  padding: 10px 10px 0;
`;

const QuestWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 95vh;
  padding: 30px 5px 0;
  color: #fff;
  overflow-y: scroll;
`;

const BackgroundBlur = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-image: url("./background.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(5px);
`;

function App() {
  const [traders, setTraders] = useState([]);
  const [selectedTrader, selectTrader] = useState(null);

  async function pickTrader(trader) {
    selectTrader(trader);
  }

  async function updateQuest(quest, traderName) {
    await UpdateQuest(quest, traderName, traders).then((updatedTraders) => {
      setTraders(updatedTraders);
    })
  }

  useEffect(() => {
    AppStarter().then((r) => setTraders(r));
  }, []);

  return (
    <MainWrapper>
      <TraderWrapper>
        {traders.map((trader) => {
          return (
            <Trader key={trader.name} trader={trader} select={pickTrader} />
          )
        })}
      </TraderWrapper>
      <QuestWrapper>
        {selectedTrader ? <QuestLog quests={selectedTrader.quests} traderName={selectedTrader.name} updateQuest={updateQuest} /> : <p>Pick a trader</p>}
      </QuestWrapper>
      <BackgroundBlur />
    </MainWrapper>
  );
}

render(<App />, document.getElementById('root'));

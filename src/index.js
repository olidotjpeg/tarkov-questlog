import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import './style.css';
import {UpdateQuest, AppStarter} from './QuestService';
import Trader from './Trader';
import QuestLog from './QuestLog';

const TraderWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 600px;
  color: #fff;
  margin: 0 auto;
`;

const BackgroundBlur = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-image: url("https://cdn.discordapp.com/attachments/720665957915295774/720666048340295751/2020-03-1312-23_-14.5_28.4_-39.7_0.1_-0.4_0.1_0.9_0.png");
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
    <React.Fragment>
      <TraderWrapper>
        {traders.map((trader) => {
          return (
            <Trader key={trader.name} trader={trader} select={pickTrader} />
          )
        })}

        {selectedTrader ? <QuestLog quests={selectedTrader.quests} traderName={selectedTrader.name} updateQuest={updateQuest} /> : <p>Pick a trader</p>}
      </TraderWrapper>
      <BackgroundBlur />
    </React.Fragment>
  );
}

render(<App />, document.getElementById('root'));

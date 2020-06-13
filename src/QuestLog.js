import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  border: 1px solid blue;
`;

export default ({ quests, traderName, updateQuest }) => {
  return (
    <div>
      {quests.length > 0 ? quests.map((quest) => {
        return (
          <Box key={quest.name} onClick={() => updateQuest(quest, traderName)}>
            <p>{quest.name}</p>
            {quest.objectives.map((q) => <p key={q}>{q}</p>)}
            {quest.state ? <p>True</p> : <p>False</p>}
          </Box>
        )
      }) : <p>We have no quests yet for this trader</p>}
    </div>
  )
};

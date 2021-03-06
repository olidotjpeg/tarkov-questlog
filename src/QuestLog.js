import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
`;

const Content = styled.div`
    width: 50%;
    padding: 7px;
`;

const Box = styled.div`
  border: 1px solid ${props => props.completed ? 'green' : 'red'};
`;

export default ({ quests, traderName, updateQuest }) => {
    return (
        <Wrapper>
            <Content>
                <p>Incomplete Quests</p>
                {quests.length > 0 ? quests.map((quest) => {
                    return !quest.state ? (
                        <Box key={quest.name} onClick={() => updateQuest(quest, traderName)}>
                            <p>{quest.name}</p>
                            {quest.objectives.map((q) => <p key={q}>{q}</p>)}
                            {quest.not_required_for_kappa ? <p>Not Required for Kappa</p> : <p>Required for Kappa</p>}
                        </Box>
                    ) : null
                }) : <p>We have no quests yet for this trader</p>}
            </Content>
            <Content>
                <p>Completed Quests</p>
                {quests.length > 0 ? quests.map((quest) => {
                    return quest.state ? (
                        <Box completed key={quest.name + 'completed'} onClick={() => updateQuest(quest, traderName)}>
                            <p>{quest.name}</p>
                            {quest.objectives.map((q) => <p key={q}>{q}</p>)}
                            {quest.not_required_for_kappa ? <p>Not Required for Kappa</p> : <p>Required for Kappa</p>}
                        </Box>
                    ) : null
                }) : <React.Fragment />}
            </Content>
        </Wrapper>
    )
};

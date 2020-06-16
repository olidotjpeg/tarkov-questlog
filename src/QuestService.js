const __API__ = 'https://gist.githubusercontent.com/Stenkilde/def40741a9f9549ac979caaac5949da5/raw/f4fd8fa9d82719b467a37a08d433207fd36db44e/quests.json';
let Traders = [];

export async function GetQuests() {
  return fetch(__API__)
  .then(response => response.json())
  .then(data => {
    updateState(data);
    Traders = [...data, ...Traders];

    return data;
  });
}

async function selectTrader(traderName) {
  return Traders.find((trader) => {
    return trader.name === traderName;
  });
}

export function getPersistent() {
  const internal = JSON.parse(localStorage.getItem('tarkovqlogState'));
  Traders = [...internal, ...Traders];

  return internal;
}

async function updateState(traders) {
  localStorage.setItem('tarkovqlogState', JSON.stringify(traders))
}

export async function UpdateQuest(quest, traderName) {
  return await selectTrader(traderName).then((trader) => {
    const activeQuest = trader.quests.find((q) => q.name === quest.name);
    activeQuest.state = !activeQuest.state;
    updateState(Traders);

    return [...Traders];
  });
}

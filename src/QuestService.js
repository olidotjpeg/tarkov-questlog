const __API__ = 'https://gist.githubusercontent.com/Stenkilde/def40741a9f9549ac979caaac5949da5/raw/f4fd8fa9d82719b467a37a08d433207fd36db44e/quests.json';
const isNumericRegex = /\d+/;
// List of characters that are valid in a URL
const base58Characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+!*$".split('')

// Internal state
let Traders = [];

export async function GetQuests() {
  return fetch(__API__, { cache: "force-cache" })
  .then(response => response.json())
  .then(data => {
    updateState(data);
    Traders = [...data, ...Traders];

    return data;
  });
}

export function getPersistent() {
  const internal = JSON.parse(localStorage.getItem('tarkovqlogState'));
  Traders = [...internal, ...Traders];

  return internal;
}

export async function UpdateQuest(quest, traderName) {
  return await selectTrader(traderName).then((trader) => {
    const activeQuest = trader.quests.find((q) => q.name === quest.name);
    activeQuest.state = !activeQuest.state;
    updateState(Traders);

    return [...Traders];
  });
}

async function ShareProgress(data) {
  return data.reduce((uri, guy, guyIndex) => {
    const characters = guy.quests
        .map((quest, questIndex) => {
          if (questIndex > base58Characters.length) {
            throw new Error("Index too high, can't be mapped to a base58 character")
          }

          return quest.state ? base58Characters[questIndex] : undefined
        })
        .filter((char) => char !== undefined)

    // Exclude guys without quest modifications, making the URI smaller
    if (characters.length === 0) {
      return uri
    }

    return uri + `${guyIndex}${characters.join('')}`
  }, "")
}

export async function LoadProgress(uri, data) {
  const numberRegex = /(\d+)/;
  let guyIndex = 0;

  // you have to account for indexes that are above 9 and thus have multiple characters
  for (const group of uri.split(numberRegex).filter(x => x !== '' && x !== undefined)) {
    if (numberRegex.test(group)) {
      guyIndex = Number(group)
    } else {
      for (const char of group.split('')) {
        const questIndex = base58Characters.indexOf(char)
        if (questIndex === -1) {
          throw new Error('Invalid URI supplied, character not recognized')
        }

        if (!data[guyIndex]) {
          throw new Error('Invalid index for guy')
        }

        data[guyIndex].quests[questIndex].state = true
      }
    }
  }

  return data
}

async function selectTrader(traderName) {
  return Traders.find((trader) => {
    return trader.name === traderName;
  });
}

export async function updateState(traders) {
  localStorage.setItem('tarkovqlogState', JSON.stringify(traders));
  ShareProgress(traders).then((res) => {
    let shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set('state', res);
    console.log(res);
    window.history.pushState('newState', 'Test123', shareUrl.href);
  })
}

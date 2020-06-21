// List of characters that are valid in a URL
const base58Characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+!*$".split('');

export function GetQuests() {
  return fetch('./data.json', { cache: "force-cache" })
  .then(response => response.json())
  .then(data => {
    return data;
  }).catch((err) => console.log(err));
}

export async function UpdateQuest(quest, traderName, traders) {
  const selectedTrader = selectTrader(traders, traderName);
   const activeQuest = selectedTrader.quests.find((q) => q.name === quest.name);
   activeQuest.state = !activeQuest.state;
   updateState(traders);

   return [...traders];
}

function ShareProgress(data) {
  return data.reduce((uri, guy, guyIndex) => {
    const characters = guy.quests
        .map((quest, questIndex) => {
          if (questIndex > base58Characters.length) {
            throw new Error("Index too high, can't be mapped to a base58 character")
          }

          return quest.state ? base58Characters[questIndex] : undefined
        })
        .filter((char) => char !== undefined);

    // Exclude guys without quest modifications, making the URI smaller
    if (characters.length === 0) {
      return uri
    }

    return uri + `${guyIndex}${characters.join('')}`
  }, "")
}

export function LoadProgress(uri, data) {
  const numberRegex = /(\d+)/;
  let guyIndex = 0;

  // you have to account for indexes that are above 9 and thus have multiple characters
  for (const group of uri.split(numberRegex).filter(x => x !== '' && x !== undefined)) {
    if (numberRegex.test(group)) {
      guyIndex = Number(group)
    } else {
      for (const char of group.split('')) {
        const questIndex = base58Characters.indexOf(char);
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

function selectTrader(traders, traderName) {
  return traders.find((trader) => {
    return trader.name === traderName;
  });
}

export function updateState(traders) {
  const sharedResponse = ShareProgress(traders);
  let shareUrl = new URL(window.location.origin);
  console.log(shareUrl);
  if (shareUrl.origin === 'https://olidotjpeg.github.io') {
    console.log("weee");
  }
  shareUrl.searchParams.set('state', sharedResponse);
  window.history.replaceState('', '', shareUrl.href);
}

export function AppStarter() {
  return GetQuests().then((traders) => {
    if (window.location.search.length > 0) {
      const stateParam = new URLSearchParams(window.location.search.substring(1));
      if (stateParam.get('state').length > 0) {
        return LoadProgress(stateParam.get('state'), traders);
      }
      return traders;
    }
    return traders;
  })
}

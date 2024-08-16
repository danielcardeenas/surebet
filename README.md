
<p align="center">
  <img width="369" height="84" src="https://github.com/user-attachments/assets/a21cff5d-9433-4015-91a9-867642b2c89c">
</p>

# surebet 💵
[![GitHub license](https://img.shields.io/github/license/danielcardeenas/surebet)](https://github.com/danielcardeenas/surebet/blob/master/LICENSE)
[![codebeat badge](https://codebeat.co/badges/7e510d47-8689-49da-abd8-a9a29d106a2b)](https://codebeat.co/projects/github-com-danielcardeenas-surebet-main)

> Extendible, customizable real-time arbitrage scanning and placing software

## Map
- [<code>Getting Started</code>](#-getting-started)
- [<code>🔋 Features</code>](#️-features)
- [<code>🖥️ Working example</code>](#️-working-example)
- [<code>📦 Build</code>](#-build)
 
## ⚡ Getting Started
```ts
import { H2HArber } from '@arbers';
import { Betfair, Bookmaker } from '@bookies';
import { money } from '@money/currencies';

// Make instances
const [betfair, bookmaker] = await Promise.all([
  Betfair.instance({ headless: false }, money.USD),
  Bookmaker.instance({ headless: false }, money.USD),
]);

// Login if needed
await Promise.all([
  betfair.login({ user: 'yourUser', password: 'yourPassword' }),
]);

// Set quantity to invest per opportunity
const investment = { amount: 200, currency: fiats.USD };

// Create retrievers
const retrievers = [
  {
    bookie: betfair,
    retriever: () => betfair.repo().live.tennis.h2h({ include: ['back'] }),
  },
  {
    bookie: bookmaker,
    retriever: () => bookmaker.repo().live.tennis.h2h(),
  },
];

// Start predefined arber (ML / Head 2 Head markets)
const tennisArber = new H2HArber(retrievers, investment);
tennisArber.start();

// Listen to close event
tennisArber.closed.pipe(take(1)).subscribe(() => {
  process.exit(0);
});

```

After this the arber will start to search for opportunities given by the retrievers.
It uses fuzzy string matching [fuzzball.js](https://github.com/nol13/fuzzball.js) to match the same event/asset across bookies

For example:
<p align="left">
  <img src="https://github.com/user-attachments/assets/16d53304-66f5-4536-9416-a0f6a9c73560" alt="shell example" width="550"/>
</p>

## 🔋 Features
The following features are included in the project
| Feature              | Status                                                                                     |
| -------------------- |:---------------------------------------------------------------------------------------   |
| Retriever agnostic    | Retrievers can be websockets, api calls, selenium, playwright, puppeteer, etc. Just implement common interface |
| Multiple sources/bookies    | Arber can run multiple tough sources/bookies at the same time and place the bets accordingly |
| Customizable arber    | Custom strategies supported. See [base arber](https://github.com/danielcardeenas/surebet/blob/main/src/app/arbers/base/arber.ts) to implement. <br> Examples for [h2h arber](https://github.com/danielcardeenas/surebet/blob/main/src/app/arbers/h2h/h2h-arber.ts) (tennis, mma) or [1x2 arber](https://github.com/danielcardeenas/surebet/blob/main/src/app/arbers/h2h/1x2.arber.ts) (soccer) markets |
| Customizable genetic strategy | See available strategies: [genetics](https://github.com/danielcardeenas/surebet/tree/main/src/app/genetics) |
| Fiat conversion       | See: [here](https://github.com/danielcardeenas/surebet/tree/main/src/app/money) for rates. (Right now hardcoded) |
| Fuzzy string matching | Fuzzy string to match equal events between sources even when the names dont match exactly |

## 🖥️ Working example


https://github.com/user-attachments/assets/9283abda-3a35-4de4-a237-0c877d20e8a6




## 📦 Build
```sh
> npm install
> npm run build
```

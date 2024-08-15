
<p align="center">
  <img width="369" height="84" src="https://github.com/user-attachments/assets/a21cff5d-9433-4015-91a9-867642b2c89c">
</p>

## 💵 surebet 
Extendible, customizable real-time arbitrage scanning and placing software

## Map
- [<code>Getting Started</code>](#-getting-started)
- [<code>🔋 Features</code>](#️-features)
- [<code>📦 Build</code>](#-build)
- [<code>🖥️ Working example</code>](#️-working-example)
 
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
| -------------------- |:---------------------------------------------------------------------------------------:   |
| Fiat conversion      | uses cashify.js see: https://github.com/danielcardeenas/surebet/tree/main/src/app/money |

## 🖥️ Working example
https://github.com/user-attachments/assets/0b1480a3-2b19-4539-9a38-f8b1ec3e10a2


## 📦 Build
```sh
> npm install
> npm run build
```

# FootyBit

This is a prototype of blockchain based football manager game.

## Inspiration

[Football manager](https://www.footballmanager.com/) game is a game where you play as a manager of a football club. You have to manage your team and your players. You can hire new players, sell them, train them. 


## What it does

In this project, you will be able to create your own football club and manage it. You can also play against other football clubs(currently bot). Everything is based on blockchain technology (payments, transactions, and so on).

## How we built it

### Frontend

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Ant Design](https://ant.design/)

### Backend

- [NodeJS](https://nodejs.org/)
- [DigitBits SDK](https://digitalbits.io/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Architecture

<img src="https://i.imgur.com/MgEJDKj.png" alt="architecture" width="100%">

## Challenges we ran into

- Website not responsive
- Game vs bot is not real time based. Currently is using pooling.
- No queue system for payment and transaction.
- React Statemanagement bugs (I'm not good at frontend)

## Accomplishments that we're proud of

- Create a team
- Authentication using XDB public key and private key
- Get 11 players and a manager
- Play online vs bot and win rewards
- Buy skill booster from store using XDB as payment method
- use booster to increase skill of players
- Game attacking and defending control vs bot


## What we learned

Simple and fast to build a blockchain based game using digitalbits SDK and nodejs.

## What's next for FootyBit

- Online match vs other players
- Use manager tactics to play match
- 2D graphics for match both online and vs bot
- Transfer players to other team and vice versa using XDB as payment method
- Sell boosters to other players using XDB as payment method
- Metauniverse football league for players to join
- Match statistics
- Player statistics
- Manager statistics
- New items for store
- Connect game to online wallet

## Useful links

- [Client Source Code](https://github.com/NazeemNato/footybit-client)
- [Server Source Code](https://github.com/NazeemNato/footybit-server)
- [FootyBit Website](https://footybit.vercel.app/#/)
- [FootyBit API](https://footybit-server.nazeemnato.repl.co/api/v1)
- [Youtube]("https://youtu.be/D3Biv7ZL1hA)

## Update [28-11-2021]

- Updated backend and frontend
- Added new features

## Note

- This is a prototype / demo. It is not a real game.
- Sorry for any bugs and bad design.
- <i> sorry for bad english</i>
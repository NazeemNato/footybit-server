import "dotenv/config"
import express from 'express';
import cors from 'cors';
import user from "./routes/user_route"
import team from "./routes/team_route"
import item from "./routes/item_route"
import game from "./routes/game_route"
import reward from "./routes/reward_route"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiUrl = '/api/v1';
app.use(apiUrl, user);
app.use(apiUrl, team);
app.use(apiUrl, item);
app.use(apiUrl, game);
app.use(apiUrl, reward);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
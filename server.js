import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.text());

app.get('/', (req, res) => {
    res.send('IGDB Proxy is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

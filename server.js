const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.text());

// ⚠️ ВСТАВЬ СВОИ КЛЮЧИ
const CLIENT_ID = '40v4o67tpwiavbmv3sygyxzrz0icbz';
const CLIENT_SECRET = '5br4gno5vbsrijbtmfkpkyzsyni8x7';

let token = null;
let tokenExpiry = 0;

async function getToken() {
    if (token && Date.now() < tokenExpiry) return token;
    
    console.log('🔄 Получаем новый токен...');
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials'
        })
    });
    
    const data = await res.json();
    token = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    console.log('✅ Токен получен, истекает через', data.expires_in, 'сек');
    return token;
}

// Главный эндпоинт для поиска игр
app.post('/api/igdb', async (req, res) => {
    try {
        const token = await getToken();
        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain'
            },
            body: req.body
        });
        
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(500).json({ error: err.message });
    }
});

// Эндпоинт для нескольких игр (подсказки)
app.post('/api/igdb/multiple', async (req, res) => {
    try {
        const token = await getToken();
        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain'
            },
            body: req.body
        });
        
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 IGDB прокси работает на порту ${PORT}`);
});
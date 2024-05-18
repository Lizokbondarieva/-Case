const express = require('express');
const db = require('./db');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const getUsdToUah = async () => {
    const apiUrl = 'https://openexchangerates.org/api/latest.json';
    const apiKey = 'YOUR_API_KEY';
    const response = await axios.get(`${apiUrl}?app_id=${apiKey}&symbols=UAH`);
    return response.data.rates.UAH;
};

app.get('/usd-to-uah', async (req, res) => {
    try {
        const rate = await getUsdToUah();
        res.json({ usd_to_uah: rate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/subscribe', (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.run('INSERT INTO subscriptions (email) VALUES (?)', [email], (err) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ error: 'Email already subscribed' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Subscribed successfully' });
    });
});

const init = async () => {
    await db.migrate();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

init();

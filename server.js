const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('public'));

// Dados em memória (simples para demonstração)
let voucherData = {
  counts: [0, 0, 0, 0, 0],
  messages: [
    "1️⃣ Vale um Beijo Apaixonado 💋❤️\n\nResgatável a qualquer momento, sem prazo de validade!",
    "2️⃣ Vale um Abraço Apertado 🤗💕\n\nDaqueles que aquecem o coração e fazem esquecer os problemas.",
    "3️⃣ Vale um Pedido de Desculpas 🙈💞\n\nPara quando as palavras não forem suficientes, mas o amor sim.",
    "4️⃣ Vale uma Sessão de Mimos 🥰✨\n\nCarinho, cafuné e atenção garantidos por tempo ilimitado.",
    "5️⃣ Vale um Momento Só Nosso ⏳💑\n\nSem celular, sem distrações, só nós dois aproveitando juntos."
  ]
};

// Rotas da API
app.get('/api/vouchers', (req, res) => {
  res.json(voucherData);
});

app.post('/api/vouchers/:id', (req, res) => {
  const id = parseInt(req.params.id) - 1;
  if (id >= 0 && id < 5) {
    voucherData.counts[id]++;
    res.json({ success: true, count: voucherData.counts[id] });
  } else {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Rota para imagens
app.get('/imagens/:file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'imagens', req.params.file));
});

// Rota principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

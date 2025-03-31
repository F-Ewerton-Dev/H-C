const express = require('express');
const path = require('path');
const { createClient } = require('@vercel/kv');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Configuração do Vercel KV
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Dados iniciais (caso não existam no KV)
const initialData = {
  counts: [0, 0, 0, 0, 0],
  messages: [
    "1️⃣ Vale um Beijo Apaixonado 💋❤️\n\nResgatável a qualquer momento, sem prazo de validade!",
    "2️⃣ Vale um Abraço Apertado 🤗💕\n\nDaqueles que aquecem o coração e fazem esquecer os problemas.",
    "3️⃣ Vale um Pedido de Desculpas 🙈💞\n\nPara quando as palavras não forem suficientes, mas o amor sim.",
    "4️⃣ Vale uma Sessão de Mimos 🥰✨\n\nCarinho, cafuné e atenção garantidos por tempo ilimitado.",
    "5️⃣ Vale um Momento Só Nosso ⏳💑\n\nSem celular, sem distrações, só nós dois aproveitando juntos."
  ]
};

// Rota para obter os dados
app.get('/api/vouchers', async (req, res) => {
  try {
    const data = await kv.get('voucherData') || initialData;
    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao carregar dados" });
  }
});

// Rota para atualizar um voucher
app.post('/api/vouchers/:id', async (req, res) => {
  try {
    const voucherId = parseInt(req.params.id) - 1;
    
    if (voucherId < 0 || voucherId >= 5) {
      return res.status(400).json({ error: "ID de voucher inválido" });
    }

    // Busca os dados atuais ou usa os iniciais
    const data = await kv.get('voucherData') || initialData;
    data.counts[voucherId]++; // Incrementa o contador

    // Salva no Vercel KV
    await kv.set('voucherData', data);

    res.json({ 
      success: true,
      newCount: data.counts[voucherId]
    });
  } catch (error) {
    console.error("Erro ao atualizar voucher:", error);
    res.status(500).json({ error: "Erro ao salvar dados" });
  }
});

// Rota para servir imagens
app.get('/imagens/:file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'imagens', req.params.file));
});

// Rota principal (frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;

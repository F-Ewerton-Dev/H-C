const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Configurações básicas
app.use(express.json());
app.use(express.static('public'));

// Habilita CORS para o frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Caminho para o arquivo de dados
const dataPath = path.join(__dirname, 'dados.json');

// Função para ler dados
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('Erro ao ler dados:', err);
    return null;
  }
};

// Função para salvar dados
const saveData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Erro ao salvar dados:', err);
    return false;
  }
};

// Rota principal - serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Obter todos os vouchers
app.get('/api/vouchers', (req, res) => {
  const data = readData();
  if (!data) return res.status(500).json({ error: 'Erro ao carregar dados' });
  res.json(data);
});

// API: Atualizar um voucher
app.post('/api/vouchers/:id', (req, res) => {
  const voucherId = parseInt(req.params.id) - 1; // IDs começam em 1
  
  const data = readData();
  if (!data) return res.status(500).json({ error: 'Erro ao carregar dados' });

  // Validação
  if (voucherId < 0 || voucherId >= data.counts.length) {
    return res.status(400).json({ error: 'ID de voucher inválido' });
  }

  // Incrementa o contador
  data.counts[voucherId]++;
  
  if (saveData(data)) {
    res.json({ 
      success: true,
      newCount: data.counts[voucherId]
    });
  } else {
    res.status(500).json({ error: 'Erro ao salvar dados' });
  }
});

// Inicializa dados se não existirem
if (!fs.existsSync(dataPath)) {
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
  saveData(initialData);
}

// Inicia o servidor local (apenas para desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// Exporta para o Vercel
module.exports = app;

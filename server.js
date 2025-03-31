const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static('public'));

// Caminho para o arquivo JSON
const dataPath = path.join(__dirname, 'dados.json');

// Rota para obter os dados
app.get('/api/vouchers', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler os dados');
        }
        res.json(JSON.parse(data));
    });
});

// Rota para atualizar os dados
app.post('/api/vouchers', (req, res) => {
    const newData = req.body;
    
    fs.writeFile(dataPath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao salvar os dados');
        }
        res.json({ success: true });
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Verifica se o arquivo JSON existe, se não, cria com dados iniciais
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
        
        fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
    }
});
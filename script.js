const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Verifique as credenciais (aqui simulado)
    if (username === 'usuario' && password === 'senha123') {
        // Cria um token JWT
        const token = jwt.sign({ username }, 'secreta-chave', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

axios.get('https://api-academia.com/treinos', {
  headers: {
    'Authorization': `Bearer ${token}` // Token recebido no login
  }
})
.then(response => {
  console.log(response.data); // Exibe os treinos
})
.catch(error => {
  console.error("Erro ao acessar a API", error);
});
app.post('/upload-video', upload.single('video'), (req, res) => {
  const videoUrl = req.file.path;
  // Salvar a URL do vídeo no banco de dados junto com o ID do usuário
  res.json({ message: 'Vídeo enviado com sucesso!', videoUrl });
});
axios.get('https://api-academia.com/progresso', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => {
  // Renderiza os dados do progresso em um gráfico
})
.catch(error => {
  console.error("Erro ao obter progresso", error);
});

// sessão login 

const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const form = document.querySelector("form") 
const btnEntrar = document.getElementById("entrar")
const resultError = document.querySelector(".result-error")


const API_BASE_URL = 'https://api-gym-1.onrender.com';


// obter o token

async function obterToken() {
    const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "username": "usuario1",  // Definido com "usuario1"
            "password": "senha1"     // Definido com "senha1"
        })
    });

    if (!response.ok) {
        throw new Error("Erro ao obter token");
    }

    const data = await response.json();
    return data.access_token;
}

async function obterExercicios(token) {
    const response = await fetch(`${API_BASE_URL}/exercicios?skip=0&limit=100&username=usuario1&password=senha1`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}` // Envia o token no cabeçalho
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao obter exercícios: ${errorText}`);
    }

    const exercicios = await response.json();
    return exercicios;
}


 function renderCards(exercicios) {
      const container = document.getElementById('cards-section');
      container.innerHTML = ""; 

      
      
      exercicios.forEach(exercicio => {
        const card = document.createElement('article');
        card.classList.add('card-container');


        // Adiciona o título
        const title = document.createElement('h3');
        title.textContent = exercicio.nome || 'Sem título';
        card.appendChild(title);
        title.classList.add('title-api');

        // Adiciona o vídeo
        const videoUrl = exercicio.url_video;
        if (videoUrl) {
          const videoId = videoUrl.split('v=')[1]?.split('&')[0];
          if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.width = '560';
            iframe.height = '315';
            iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            card.appendChild(iframe);

          }
        } else {
          const noVideoText = document.createElement('p');
          noVideoText.textContent = 'Sem vídeo disponível';
          card.appendChild(noVideoText);
        }

        // Adiciona a descrição
        const description = document.createElement('p');
        description.textContent = exercicio.descricao || 'Sem descrição';
        description.classList.add('descricao')
        card.appendChild(description);

        // Adiciona o card ao container
        container.appendChild(card);
      });
    }

    // Fluxo principal
(async () => {
    try {
        const token = await obterToken();

        const exercicios = await obterExercicios(token);
        renderCards(exercicios); 
    } catch (error) {
        console.error("Erro ao obter dados:", error);
    }
})();
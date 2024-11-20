// api

const API_BASE_URL = "https://api-gym-1.onrender.com";

// obter o token

async function obterToken() {
  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: "usuario1", 
      password: "senha1", 
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao obter token");
  }

  const data = await response.json();
  return data.access_token;
}

// GET
async function obterExercicios(token) {
  const response = await fetch(
    `${API_BASE_URL}/exercicios?skip=0&limit=100&username=usuario1&password=senha1`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro detalhado ao obter exercícios:", errorText); // Exibe erro detalhado
    throw new Error(`Erro ao obter exercícios: ${errorText}`);
  }

  const exercicios = await response.json();
  console.log("Exercícios recebidos:", exercicios);
  return exercicios;
}

function renderCards(exercicios) {
  const container = document.getElementById("cards-section");
  container.innerHTML = "";

  exercicios.forEach((exercicio) => {
    const card = document.createElement("article");
    card.classList.add("card-container");

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container"); 

    const idExercicio = document.createElement("span")
    idExercicio.classList.add("IdExercicio")

    const title = document.createElement("h3");
    title.textContent = exercicio.nome || "Sem título";
    title.classList.add("title-api");

    
    const deleteButton = document.createElement("i");
    deleteButton.classList.add("bi-trash");

    
    // delete
    
    deleteButton.addEventListener("click", async () => {
      try {
        const token = await obterToken();

        const response = await fetch(
          `https://api-gym-1.onrender.com/exercicios/${exercicio.id}?username=usuario1&password=senha1`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          card.remove();
          alert("excluido com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao excluir exercício:", error);
      }
    });

    titleContainer.appendChild(title);
    titleContainer.appendChild(deleteButton);
    title.appendChild(idExercicio)
    card.appendChild(titleContainer);

    const videoUrl = exercicio.url_video;
    if (videoUrl) {
      const videoId = videoUrl.split("v=")[1]?.split("&")[0];
      if (videoId) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.width = "560";
        iframe.height = "315";
        iframe.allow =
          "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        card.appendChild(iframe);
      }
    } else {
      const noVideoText = document.createElement("p");
      noVideoText.textContent = "Sem vídeo disponível";
      card.appendChild(noVideoText);
    }


    const description = document.createElement("p");
    description.textContent = "DESCRIÇÃO: " +exercicio.descricao || "Sem descrição";
    description.classList.add("descricao");
    idExercicio.textContent =  "ID " + exercicio.id 
    card.appendChild(description);

   
    container.appendChild(card);
  });
}
document.getElementById("consultar-exercicios")
  .addEventListener("click", async () => {
    try {
      const token = await obterToken();
      console.log("Token:", token);

      const exercicios = await obterExercicios(token);
      renderCards(exercicios);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  });

// POST

async function enviarExercicios(token, dadosExercicios) {
  const response = await fetch(
    `${API_BASE_URL}/exercicios?username=usuario1&password=senha1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosExercicios),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro detalhado ao enviar exercícios:", errorText);
    throw new Error(`Erro ao enviar exercícios`);
  }

  const resultado = await response.json();
  console.log("Exercícios enviados com sucesso:", resultado);
  return resultado;
}


document.getElementById("enviarBtn").addEventListener("click", async () => {
  try {

    const dadosExercicios = {
      nome: document.getElementById("titlePost").value,
      url_video: document.getElementById("linkPost").value,
      descricao: document.getElementById("descricaoPost").value,
      username: "usuario1", 
      password: "senha1", 
    };


    const token = await obterToken();

    const resultado = await enviarExercicios(token, dadosExercicios);


    const sucessoPost = document.querySelector(".sucesso");
    sucessoPost.textContent = "Exercício criado com sucesso!";
    const exercicios = await obterExercicios(token);
    renderCards(exercicios)


    document.getElementById("titlePost").value = "";
    document.getElementById("linkPost").value = "";
    document.getElementById("descricaoPost").value = "";

    console.log("Resultado da API:", resultado);
  } catch (erro) {
    console.error("Erro:", erro);
    alert("Erro ao enviar os exercícios. Verifique o console para detalhes.");
  }
});

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    const sucessoPost = document.querySelector(".sucesso");
    const sucessoPut = document.querySelector(".sucessoPut");
    sucessoPost.textContent = "";
    sucessoPut.textContent = "";
  });
});


// put

document.getElementById("enviarBtnPut").addEventListener("click", async () => {

  try {

    const exercicioId = document.getElementById("idPut").value;
    const dadosExercicios = {
      nome: document.getElementById("titlePut").value,
      url_video: document.getElementById("linkPut").value,
      descricao: document.getElementById("descricaoPut").value,
    };

    if (!exercicioId) {
      alert("Por favor, insira um ID válido.");
      return;
    }

    const token = await obterToken();

    const response = await fetch(
      `${API_BASE_URL}/exercicios/${exercicioId}?username=usuario1&password=senha1`, 
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosExercicios), 
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro ao editar exercício:", errorText);
      throw new Error("Erro ao editar exercício");
    }

    const resultado = await response.json();
    console.log("Exercício editado com sucesso:", resultado);

    // Exibe a mensagem de sucesso
    const sucessoPut = document.querySelector(".sucessoPut");
    sucessoPut.textContent = "Exercício editado com sucesso!";
    sucessoPut.classList.add("sucessoPut")

    // Limpa os inputs
    document.getElementById("idPut").value = "";
    document.getElementById("titlePut").value = "";
    document.getElementById("linkPut").value = "";
    document.getElementById("descricaoPut").value = "";

  } catch (erro) {
    console.error("Erro:", erro);
    alert("Erro ao editar o exercício. Verifique o console para detalhes.");
  }
});

// Selecionando os elementos
const formPost = document.querySelector('.post');
const formPut = document.querySelector('.put');
const criarExercicioIcon = document.querySelector('.bi-file-earmark-plus');
const editarExercicioIcon = document.querySelector('.bi-pencil-square');

// Função para mostrar o formulário de criar exercício
criarExercicioIcon.addEventListener('click', () => {
  formPost.style.display = 'block';  
  formPut.style.display = 'none';   
});


editarExercicioIcon.addEventListener('click', () => {
  formPut.style.display = 'block';  
  formPost.style.display = 'none'; 
});


function esconderFormularios() {
  formPost.style.display = 'none';
  formPut.style.display = 'none';
}
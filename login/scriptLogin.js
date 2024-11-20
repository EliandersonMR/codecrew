// sessão login 

const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const form = document.querySelector("form") 
const btnEntrar = document.getElementById("entrar")
const resultError = document.querySelector(".result-error")

const email = "professor@gmail.com"
const senha = 123

const emailAluno1 = "aluno@gmail.com"
const senhaAluno1 = 321


form.addEventListener('submit', function(event) {
  event.preventDefault(); 

  
  let inputUsuarioValue = inputUsuario.value;
  let inputPasswordValue = inputPassword.value;

function verificarCredencias(emailProf, senhaProf){

  if (emailProf == email && senhaProf == senha){

    window.location.href = "https://codecrew-fit.netlify.app/professor.html"

  }else{

    resultError.innerHTML = "sua senha ou email está errado!"
   
  }

 

} 

 function verificarCredenciasAluno(emailAluno, senhaAluno){

  if (emailAluno == emailAluno1 && senhaAluno == senhaAluno1){

    window.location.href = "https://codecrew-fit.netlify.app/aluno.html"

  }else{

    resultError.innerHTML = "sua senha ou email está errado!"
   
  }

} 

verificarCredenciasAluno(inputUsuarioValue, inputPasswordValue)

verificarCredencias(inputUsuarioValue, inputPasswordValue)



});



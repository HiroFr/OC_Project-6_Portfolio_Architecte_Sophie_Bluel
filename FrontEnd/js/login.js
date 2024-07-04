import {base_URL, loginUser} from "./config.js";

// Fonction pour gérer la soumission du formulaire de connexion
const submit = document.getElementById('submit');
const divError = document.querySelector(".errorPassword");
const textError = document.getElementById('textError');

function afficherErreur(message) {
  divError.style.visibility = "visible";
  textError.innerHTML = message;
}

function login(event) {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire (soumission)

  // Récupérer les valeurs du formulaire
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email && !password) {
    afficherErreur("Les informations ne peuvent pas être vide.");
  }

  // Envoyer les données au serveur avec une requête POST
  event.preventDefault();
  fetch(base_URL + loginUser, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: email,
        password: password
      })
  })
  .then(response => {
    // Si le statut est 200, on ne fais rien
    if (response.status === 200) {
      return response.json();

      // Si le statut est 401, on affiche un message d'erreur spécifique
    } else if (response.status === 401) {
      afficherErreur("Les informations de connexion sont incorrectes");
    }
    console.log(response.status);
  })
  .then(data => {
    // Token est présent dans la réponse
    if (data.token) {
      console.log(data.token);
        // Stocker le token dans le session storage
        sessionStorage.setItem('token', data.token);
        // Rediriger vers la page d'accueil
        window.location.href = '../index.html';
    } else {
      afficherErreur("Une erreur est survenue !");
    }
  })
  .catch(error => console.error('Erreur:', error));
};

submit.addEventListener('click', login);
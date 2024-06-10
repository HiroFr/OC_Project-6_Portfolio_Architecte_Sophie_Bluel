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

  if (!email || !password) {
    afficherErreur("Les infos ne peut pas être vide.");
  }

  console.log("Récupération des valeurs des Input : " + email, password);
  // Envoyer les données au serveur avec une requête POST
  event.preventDefault();
  fetch('http://localhost:5678/api/users/login', {
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
    if (response.status === 200) {
      // Si le statut est 200, on ne fais rien
      return response.json();
    } else if (response.status === 401) {
      // Si le statut est 401, on affiche un message d'erreur spécifique
      afficherErreur("Les informations de connexion sont incorrectes");
    }
    console.log(response.status);
  })
  .then(data => {
    console.log("Réponse du serveur :", data);
    // Token est présent dans la réponse
    if (data.token) {
        console.log("Token reçu :", data.token);
        // Stocker le token dans le session storage
        sessionStorage.setItem('token', data.token);
        // Rediriger vers la page d'accueil
        console.log("Redirection vers la page d'accueil");
        window.location.href = '../index.html';
    } else {
        console.log("Token non trouvé dans la réponse du serveur.");
    }
  })
  .catch(error => console.error('Erreur:', error));
};

submit.addEventListener('click', login);


/* "email": "sophie.bluel@test.tld",
"password": "S0phie" */
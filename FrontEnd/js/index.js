import { token, base_URL, category, works} from "./config.js";

const galleryContent = document.getElementById("galleryContent");
const filterContent = document.getElementById("filterContent");
const alreadyLogin = document.getElementById('alreadyLogin');
const body = document.getElementById('body');

// Fonction pour charger les projets correspondant à la catégorie sélectionnée
function loadProjects(selectedCategoryId) {
  // Nettoyer le contenu existant avant de charger de nouveaux projets
  galleryContent.innerHTML = '';

  // Récupération des projets correspondant en fonction de la catégorie sélectionnée
  fetch(base_URL + works)
    .then(res => res.json())
    .then(data => {
      data.forEach(project => {
        /* console.log("selectedCategoryId:", selectedCategoryId, "project.categoryId:", project.categoryId); */
        if (selectedCategoryId === 0 || project.categoryId === selectedCategoryId) {
          var figure = document.createElement('figure');
          figure.innerHTML = `
            <img src="${project.imageUrl}">
            <figcaption>${project.title}</figcaption>`;
          galleryContent.appendChild(figure);
        }
      });
    })
    .catch(error => console.log('Une erreur est survenue lors du chargement des projets : ' + error.message));
}

// Récupération des catégories et création des boutons de filtre
fetch(base_URL + category)
  .then(res => res.json())
  .then(data => {
    // Création du bouton "Tous"
    var allButton = document.createElement('span');
    allButton.className = "filter_button activeFilter";
    allButton.dataset.id = 0; // Id du bouton "Tous"
    allButton.innerHTML = "Tous";
    filterContent.appendChild(allButton);

    // Création des boutons pour chaque catégorie
    data.forEach(category => {
      var filterSpan = document.createElement('span');
      filterSpan.className = "filter_button";
      filterSpan.dataset.id = category.id;
      filterSpan.innerHTML = category.name;
      filterContent.appendChild(filterSpan);
    });

    // Ajout d'un écouteur d'événements à chaque bouton après les avoir créés
    var filterBtn = document.querySelectorAll('.filter_button');

    filterBtn.forEach(button => {
      const categoryId = button.dataset.id;
      button.addEventListener('click', function() {
        // Supprimez la classe "active" de tous les boutons
        filterBtn.forEach(function(btn) {
          btn.classList.remove('activeFilter');
        });
        // Ajoutez la classe "active" au bouton cliqué
        this.classList.add('activeFilter');
          /* console.log(categoryId); */
          loadProjects(parseInt(categoryId));
      }); 
    });

    // Charge tous les projets par défaut
    loadProjects(0);
  })
  .catch(error => console.log('Une erreur est survenue lors du chargement des catégories : ' + error.message));



// Function qui vérifie si on est connecté + déconnecte lors du click sur logout
function funcAlreadyLogin() {

  // Créer une balise a pour afficher du texte et un lien
  var logout = document.createElement('a');
  logout.href = "./pages/logout.html";
  logout.innerHTML = "logout";
  alreadyLogin.innerHTML = '';
  alreadyLogin.appendChild(logout);

  // EventListener qui supprime le token de la session si on est connecté
  alreadyLogin.addEventListener('click', function() {
    sessionStorage.removeItem('token');
  });

}

// function qui créer et affiche la bannière d'édition si on est connecté
function bannerLogin() {

  // Créer une div avec comme class banner et l'affiche au top
  var divB = document.createElement('div');
  divB.id = 'divBanner';
  divB.className = "banner";
  divB.innerHTML = " ";
  body.insertBefore(divB, body.firstChild);

  const divBanner = document.getElementById('divBanner');

  // Créer une balise i pour afficher l'icone via Font Awesome et l'ajoute à la banner
  var iconBanner = document.createElement('i');
  iconBanner.className = "fa-regular fa-pen-to-square";
  divBanner.appendChild(iconBanner);

  // Créer une balise p pour afficher du texte et l'ajoute à la banner
  var editionBanner = document.createElement('p');
  editionBanner.innerHTML = "Mode édition";
  divBanner.appendChild(editionBanner);
}

function log() {
  
  if (token) {

    // function qui créer et affiche la bannière d'édition si on est connecté
    bannerLogin()

    // Cache les filtres quand on est connecté
    filterContent.style.display = "none";

    // Function qui vérifie si on est connecté + déconnecte lors du click sur logout
    funcAlreadyLogin()

  } else {

    // Cache la div d'édition quand on n'est pas connecté
    var divEdit = document.getElementById('divEdit');
    divEdit.style.display = "none";

  }
}

log();
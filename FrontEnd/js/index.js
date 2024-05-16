const galleryContent = document.getElementById("galleryContent");
const filterContent = document.getElementById("filterContent");

// Fonction pour charger les projets correspondant à la catégorie sélectionnée
function loadProjects(selectedCategoryId) {
  // Nettoyer le contenu existant avant de charger de nouveaux projets
  galleryContent.innerHTML = '';

  // Récupération des projets correspondant en fonction de la catégorie sélectionnée
  fetch(`http://localhost:5678/api/works`)
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
fetch('http://localhost:5678/api/categories')
  .then(res => res.json())
  .then(data => {
    // Création du bouton "Tous"
    var allButton = document.createElement('span');
    allButton.className = "filter_button";
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
    document.querySelectorAll('.filter_button').forEach(button => {
      const categoryId = button.dataset.id;
      button.addEventListener('click', function() {
        /* console.log(categoryId); */
        loadProjects(parseInt(categoryId));
      }); 
    });

    // Charge tous les projets par défaut
    loadProjects(0);
  })
  .catch(error => console.log('Une erreur est survenue lors du chargement des catégories : ' + error.message));
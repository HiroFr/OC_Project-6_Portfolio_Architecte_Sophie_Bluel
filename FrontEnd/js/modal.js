import { token, base_URL, works} from "./config.js";
import { loadProjects } from "./index.js";

const backIcon = document.getElementById('back');
const modalEdit = document.getElementById('editModal');
const closeIcons = [
  document.getElementById('editClose'),
  document.getElementById('addClose')
];
const modalAdd = document.getElementById('addModal');
const openAddModal = document.getElementById('openAddModal');
const openEditModal = document.getElementById('openEditModal');
const validation = document.getElementById('submitAddPicture');

const divError = document.querySelector(".errorPassword");
const textError = document.getElementById('textError');

const inputAddPicture = document.getElementById('inputAddPicture');
const nameAddPicture = document.getElementById('nameAddPicture');
const nbrCategoryAddPicture = document.getElementById('nbrCategoryAddPicture');

const imageInput = document.getElementById('inputAddPicture'); // files input
const imageDisplay = document.getElementById('imageDisplay'); // images
const uploadDiv = document.getElementById('uploadDiv');
const srcImageDisplay = document.getElementById('srcImageDisplay');

function afficherErreur(message) {
  divError.style.visibility = "visible";
  textError.innerHTML = message;
}

// Fermer la modale lorsque l'utilisateur clique en dehors de celle-ci
window.onclick = function(event) {
  if (event.target == modalEdit) {
    modalEdit.style.display = 'none';
  } else if (event.target == modalAdd) {
    modalAdd.style.display = 'none';
  }
}

// Fermer la modale
function closeModal() {
  modalEdit.style.display = 'none';
  modalAdd.style.display = 'none';
}

// Retour à la modal d'édition
function backToEditModal() {
  modalAdd.style.display = 'none';
}

// ------------- EDITION D'UNE IMAGE ------------- //

// Supprime une image en fonction de son id
async function deletePicture(id) {
  try {

    const response = await fetch(base_URL + works + `/${id}`,
      { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }  
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'image");
    }

    return true;
  } catch (error) {
    console.error('Une erreur est survenue :', error);
    return false;
  }
}

// Affichage des projets + EventListener pour la suppression
function displayPicture(id, url) {

  const galery = document.getElementById('galeryAllPictures');

  const container = document.createElement('figure');
  container.className = 'image-container';
  container.setAttribute('data-id', id);

  const img = document.createElement('img');
  img.src = `${url}`;
  img.alt = `Image du projet ${id}`;

  const deleteIconDiv = document.createElement('div');
  deleteIconDiv.className = 'trash';

  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fa-solid fa-trash-can';
  deleteIconDiv.appendChild(deleteIcon);

  container.appendChild(img);
  container.appendChild(deleteIconDiv);
  galery.appendChild(container);

  deleteIconDiv.addEventListener('click', async () => {
    const success = await deletePicture(id);
    if (success) {
      loadProjects(0);
      container.remove();
    }
  });
}

// Récupère les projets
async function getWorks() {
  try {
    const response = await fetch(base_URL + works);

    if (response.ok) {
      const data = await response.json();
      data.forEach(item => {
        displayPicture(item.id, item.imageUrl);
      });
    } else {
      console.error("Erreur lors de l'ajout de l'image:", response.statusText);
    }
  } catch (error) {
    console.log('Une erreur est survenue lors du chargement des projets : ' + error.message);
    throw error;
  }
}

async function editModal() {

  const modalEdit = document.getElementById('editModal');
  const galery = document.getElementById('galeryAllPictures');

  // Nettoyer le contenu de la galerie
  galery.innerHTML = '';

  // On affiche la modale
  modalEdit.style.display = 'block';

  //Actualise le contenu de la galerie dans la modal d'édition
  await getWorks();
}



// ------------- AJOUT D'UNE IMAGE ------------- //

// Fonction pour vérifier l'état des champs et changer la couleur du bouton
function checkFormFields() {
  if (!inputAddPicture.files[0] || !nameAddPicture.value || !nbrCategoryAddPicture.value) {
    validation.classList.add("disabledInput");
  } else {
    validation.classList.remove("disabledInput");
  }
}

// Ajouter une image en tant que projet
async function postWorks() {

  // Vérifie les champs
  checkFormFields();

  const formData = new FormData();
  formData.append("image", inputAddPicture.files[0]);
  formData.append("title", nameAddPicture.value);
  formData.append("category", nbrCategoryAddPicture.value);

  try {

    const response = await fetch(base_URL + works,
      { 
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      }
    );

    // Si la réponse est valide
    if (response.ok) {
      // Ferme les modales
      closeModal();
      // Recharge les projets
      loadProjects(0);
    } else if (!response.ok) { // Sinon on renvoie une erreur
      throw new Error(`Erreur HTTP, Satut: ${response.status}`);
    }

  } catch (error) {
    console.error('Une erreur est survenue :', error.message);
    return false;
  }
}

async function addModal() {

  const modalAdd = document.getElementById('addModal');

  // On affiche la modale
  modalAdd.style.display = 'block';

  // Reset Champs
  // ----
    // Reset la valeur du champ image
  inputAddPicture.value = "";
    // Cache la div pour afficher l'image
  imageDisplay.style.display = 'none';
    // Affiche la div pour l'ajout d'une image
  uploadDiv.style.display = 'flex';
    // Ajout de la class  sur le btn de validation
  validation.classList.add("disabledInput");
    // Reset la valeur du champ Titre
  nameAddPicture.value = "";
  
}



// Ajout d'un gestionnaire d'événements pour le changement de fichier
imageInput.addEventListener('change', function(event) {

  // Récupération du fichier sélectionné
  const file = event.target.files[0];

  // Vérification qu'un fichier a bien été sélectionné
  if (file) {
    // Convertir la taille en Mo
    const fileSizeInMB = file.size / (1024 * 1024); 
    const fileType = file.type;

    // Si plus de 4 Mo
    if (fileSizeInMB > 4) {
      afficherErreur(`L'image fait plus de 4 Mo (${fileSizeInMB.toFixed(2)} Mo)`);
      inputAddPicture.value = "";
      // Si pas le bon type de fichier
    } else if (fileType !== "image/png" && fileType !== "image/jpeg") {
      afficherErreur("Le type d'image n'est pas accepté");
      inputAddPicture.value = "";
    } else {
      // Sinon on affiche l'image
      
      // Création d'un FileReader
      const reader = new FileReader();

      reader.onload = function(e) {
        // Définition de la source de l'image
        srcImageDisplay.src = e.target.result;
        // Affichage de la div pour l'image
        imageDisplay.style.display = 'flex';
        // Cache la div d'upload
        uploadDiv.style.display = 'none';
      }
      // Lecture du fichier en tant que Data URL
      reader.readAsDataURL(file);
    }
  }
});

inputAddPicture.addEventListener('change', checkFormFields);
nameAddPicture.addEventListener('input', checkFormFields);
nbrCategoryAddPicture.addEventListener('input', checkFormFields);

validation.addEventListener("click", postWorks);

openAddModal.addEventListener("click", addModal);

openEditModal.addEventListener("click", editModal);

// Attacher le gestionnaire d'événements à chaque élément du tableau
closeIcons.forEach(icon => {
  if (icon) { // Assurez-vous que l'élément existe
    icon.addEventListener("click", closeModal);
  }
});

backIcon.addEventListener("click", backToEditModal);
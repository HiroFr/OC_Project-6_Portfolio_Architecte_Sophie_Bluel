import { token, base_URL, works} from "./config.js";

const backIcon = document.getElementById('back');
const modal = document.getElementById('editModal');
const closeIcons = [
  document.getElementById('editClose'),
  document.getElementById('addClose')
];
const modalAdd = document.getElementById('addModal');
const openAddModal = document.getElementById('addBtn');
const openEditModal = document.getElementById('divEdit');
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

// Affiche un message d'erreur
function afficherErreur(message) {
  divError.style.visibility = "visible";
  textError.innerHTML = message;
}

// Fermer la modale lorsque l'utilisateur clique en dehors de celle-ci
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  } else if (event.target == modalAdd) {
    modalAdd.style.display = 'none';
  }
}

// Fermer la modale
function closeModal() {
  modal.style.display = 'none';
  modalAdd.style.display = 'none';
}

// Retour à la modal d'édition
function backToEditModal() {
  modalAdd.style.display = 'none';
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

  deleteIconDiv.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const success = await deletePicture(id);
    if (success) {
      container.remove();
    }
  });
}

async function editModal(event) {
  event.preventDefault();
  event.stopPropagation();

  const modal = document.getElementById('editModal');
  const galery = document.getElementById('galeryAllPictures');

  // Nettoyer le contenu de la galerie
  galery.innerHTML = '';

  // On affiche la modale
  modal.style.display = 'block';

  await getWorks();  
}

async function deletePicture(id) {
  try {

    const response = await fetch(base_URL + works + `/${id}`,
      { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        redirect: "manual"
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

// Fonction pour vérifier l'état des champs et changer la couleur du bouton
function checkFormFields() {
  if (!inputAddPicture.files[0] || !nameAddPicture.value || !nbrCategoryAddPicture.value) {
    return true;
  } else {
    validation.classList.remove("disabledInput");
    validation.disabled = false;
  }
}

async function postWorks() {

  checkFormFields();

  const formData = new FormData();
  formData.append("image", inputAddPicture.files[0]);
  formData.append("title", nameAddPicture.value);
  formData.append("category", nbrCategoryAddPicture.value);

  try {

    const response = await fetch('http://localhost:5678/api/works',
      { 
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
        redirect: "manual"
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
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

  // Reset fields
  // ----
    // Reset value input picture
  inputAddPicture.value = "";
    // Hide div for display picture
  imageDisplay.style.display = 'none';
    // Display div for upload picture
  uploadDiv.style.display = 'flex';
    // Add class for disabled input on btn validation
  validation.classList.add("disabledInput");
  // Reset value input name
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

    // Si plus de 4 Mo et si pas le bon type alors erreur
    if (fileSizeInMB > 4) {
      afficherErreur(`L'image fait plus de 4 Mo (${fileSizeInMB.toFixed(2)} Mo)`);
      inputAddPicture.value = "";
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
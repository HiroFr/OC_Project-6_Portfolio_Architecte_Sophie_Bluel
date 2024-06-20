const modal = document.getElementById('editModal');
const closeIcon = document.getElementById('close');
const openEditModal = document.getElementById('divEdit');

// Fermer la modale lorsque l'utilisateur clique en dehors de celle-ci
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Fermer la modale
function closeModal() {
  modal.style.display = 'none';
}

async function getWorks() {
  try {
    const response = await fetch(`http://localhost:5678/api/works`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Une erreur est survenue lors du chargement des projets : ' + error.message);
    throw error;
  }
}

async function editModal() {
  // On créer une div
  const galeryPicturesContainer = document.createElement('div');
  galeryPicturesContainer.className = 'galeryAllPictures';
  try {
    // On récupère l'appel API de getWorks
    const works = await getWorks();
    // Pour chaque projet on assigne une balise figure on y insère le contenu
    works.forEach(project => {
      const picture = document.createElement('figure');
      picture.innerHTML = `
        <div class="image-container">
          <img src="${project.imageUrl}">
          <div id="trashID" class="trash"> // pas besoin d'ID
            <i class="fa-solid fa-trash-can"></i>
          </div>
        </div>
      `;
      galeryPicturesContainer.appendChild(picture);
    });
  } catch (error) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.textContent = 'Une erreur est survenue lors du chargement des projets : ' + error.message;
    galeryPicturesContainer.appendChild(errorElement);
  }
  // revoie le contenu créer précédement avec les balises 
  return galeryPicturesContainer.outerHTML;

}

async function galeryPicures() {
  console.log('Je clique dans le contenu menu');
  // Nettoyer le contenu de la modale
  modal.innerHTML = '';
  // On affiche la modale
  modal.style.display = 'block';

  // Créer le contenu pour la modal d'ajout
  const galeryPictures = document.createElement('div');
  galeryPictures.className = 'galeryPictures';

  // Attendre le résultat de editModal puis on l'ajoute dans le contenu
  const galleryContent = await editModal(); 

  galeryPictures.innerHTML = `
    <i id="close" class="fa-solid fa-xmark closeIcon"></i>
    <h3 class="galeryTitle">Galerie Photo</h3>
    ${galleryContent}
    <div class="separator"></div>
    <a class="btnAddPicture">Ajouter une photo</a>
  `;
  // Ajouter le contenu à la div modale présent dans le dom
  modal.appendChild(galeryPictures);
}

document.addEventListener('DOMContentLoaded', () => {
const imageContainers = document.querySelectorAll('.image-container');
// Pour chaque images
imageContainers.forEach(container => {
  // On récupère la classe .trash qui correspond à la corbeille
  const deleteIcon = container.getElementById("trashID");
  // Lors du click sur la corbeille
  deleteIcon.addEventListener('click', async () => {
    console.log('Icon ok');
    // On récupère l'id associé à l'image
    const imageId = container.getAttribute('data-id');
    // On appel la function pour delete l'image en passant l'id en paramètre
    await deletePicture(imageId);
    // Puis on delete l'image
    container.remove();
  });
});
});

async function deletePicture(id) {
  console.log('Je clique sur la corbeille');
try {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error("Echec de la suppression de l'image");
  }
  const result = await response.text();
  console.log(result);
} catch (error) {
  console.error('Une erreur est survenue :', error);
}
}


if (openEditModal) {
  openEditModal.addEventListener("click", galeryPicures);
}

if (closeIcon) {
  console.log('Ajout de l\'écouteur d\'événement à l\'icône de fermeture');
  closeIcon.addEventListener('click', closeModal);
}
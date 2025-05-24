/* RECUPERATION DES ID POUR LES SECTIONS */

const body = document.body;
const events = document.getElementById("events");
const planning = document.getElementById("planning");
const containerCard = document.getElementById("container-card");
const containerFav = document.getElementById("container-fav")

/* RECUPERATION DES ID POUR LA MODALE */

const divModal = document.getElementById("modal");
const buttonCloseModal = document.getElementById("close-modal");
const titreModal = document.getElementById("modal-title");
const descriptionModal = document.getElementById("modal-description");
const dateModal = document.getElementById("modal-date");
const venueModal = document.getElementById("modal-venue");
const linkModal = document.getElementById("modal-link");
const overlayModal = document.getElementById("overlay-modal");

/* CREATION DES FONCTIONS POUR SAUVEGARDER LE PLANNING DANS LE LOCAL STORAGE ET LE RECUPERER */

function savePlanning(planningList) {
  localStorage.setItem("planning", JSON.stringify(planningList));
}

function loadPlanning() {
  const saved = localStorage.getItem("planning");
  return saved ? JSON.parse(saved) : [];
}

let userPlanning = loadPlanning();

/* RECUPERATION DES DONNEES VIA L'API */

async function fetchData() {
  try {
    const response = await fetch(
      "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events"
    );
    if (response.status === 200) {
      console.log("Données récupérées avec succès");
    }
    const data = await response.json();
    dataEvents = data.events;    
    dataEvents.forEach((event) => {
      /* CREATION A LA VOLEE DES CARTES EVENEMENTS */
      /* STRUCTURE */
      const div = document.createElement("div");
      div.classList.add("event-card");
      const title = document.createElement("h4");
      const date = document.createElement("p");
      const lieu = document.createElement("p")
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("btn-container");
      const buttonDetails = document.createElement("button");
      buttonDetails.classList.add("btn", "btn-details");
      const buttonAdd = document.createElement("button");
      buttonAdd.classList.add("btn", "btn-add");
      /* CONTENU DES EVENEMENTS ET BOUTONS */
      title.textContent = event.title;
      date.textContent = event.date;
      buttonDetails.textContent = "Voir détails";
      buttonAdd.textContent = "Ajouter";
      if (event.venue != "" && event.venue != null)  {
        lieu.textContent = `${event.venue.address} / ${event.venue.city}
      / ${event.venue.venue}`;
      } else {
        lieu.textContent = "Pas d'adresse disponible"
      }
      /* AJOUT A LA SECTION */
      div.appendChild(title);
      div.appendChild(date);
      div.appendChild(lieu);
      buttonContainer.appendChild(buttonDetails);
      buttonContainer.appendChild(buttonAdd);
      div.appendChild(buttonContainer);
      containerCard.appendChild(div);

      /* EVENEMENTS SUR LES BOUTONS */
      /* BOUTON DETAILS */
      buttonDetails.addEventListener("click", () => {
        titreModal.textContent = event.title;
        descriptionModal.innerHTML = event.description;
        dateModal.textContent = event.date;
        if (event.venue != "" && event.venue != null)  {
        venueModal.textContent = `${event.venue.address} / ${event.venue.city}
      / ${event.venue.venue}`;
      } else {
        venueModal.textContent = "Pas d'adresse disponible"
      }
        linkModal.href = event.url;
        linkModal.textContent = "Clique ici pour voir l'évènement";
        overlayModal.style.display = "flex";
      })
      buttonAdd.addEventListener("click", () => {
        const alreadyInPlanning = userPlanning.find((e) => e.id === event.id);
  if (!alreadyInPlanning) {
    userPlanning.push(event);
    savePlanning(userPlanning);
    renderPlanning();
  }
        console.log(`Ajouté au planning : ${event.title}`);
  });
    });
  } catch {
    console.log("erreur lors de la récupérations des données");
  }
}
fetchData()

buttonCloseModal.addEventListener("click", () => {
  overlayModal.style.display = "none";
})

/* AFFICHAGE DANS LE PLANNING */

function renderPlanning() {
  containerFav.innerHTML = ""; 

  if (userPlanning.length === 0) {
    containerFav.innerHTML = "<p>Aucun événement dans votre planning.</p>";
    return;
  }

  userPlanning.forEach((event) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    const title = document.createElement("h4");
    title.textContent = event.title;

    const date = document.createElement("p");
    date.textContent = event.date;

    const venue = document.createElement("p");
    venue.textContent = event.venue?.address
      ? `${event.venue.address} / ${event.venue.city} / ${event.venue.venue}`
      : "Pas d'adresse disponible";

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("btn", "btn-remove");
    removeBtn.textContent = "Retirer";

    removeBtn.addEventListener("click", () => {
      userPlanning = userPlanning.filter((e) => e.id !== event.id);
      savePlanning(userPlanning);
      renderPlanning();
    });

    const container = document.createElement("div");
    container.classList.add("btn-container");
    container.appendChild(removeBtn);

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(venue);
    card.appendChild(container);
    containerFav.appendChild(card);
  });
}
renderPlanning();


/* MISE EN PLACE DU MODE CLAIR/SOMBRE ET COOKIES POUR CETTE FEATURE */

/* FONCTION CREATION DE COOKIE */
function setCookie(name, value, days) {
  const maxAge = days * 24 * 60 * 60; 
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`;
}
/* FONCTION LECTURE DE COOKIE */
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value
    } 
  }
}

/* THEME ENREGISTRE AU CHARGEMENT */

const savedTheme = getCookie("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {

  const isDark = document.body.getAttribute("data-theme") === "dark";

  const newTheme = isDark ? "light" : "dark";

  document.body.setAttribute("data-theme", newTheme);

  setCookie("theme", newTheme, 365);
});
/* RECUPERATION DES ID POUR LES SECTIONS */
const body = document.body;
const events = document.getElementById("events");
const planning = document.getElementById("planning");
const containerCard = document.getElementById("container-card");
const containerFav = document.getElementById("container-fav");

/* RECUPERATION DES ID POUR LA MODALE */
const divModal = document.getElementById("modal");
const buttonCloseModal = document.getElementById("close-modal");
const titreModal = document.getElementById("modal-title");
const descriptionModal = document.getElementById("modal-description");
const dateModal = document.getElementById("modal-date");
const venueModal = document.getElementById("modal-venue");
const linkModal = document.getElementById("modal-link");
const overlayModal = document.getElementById("overlay-modal");

let userPlanning;

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
function closeModal() {
  overlayModal.style.display = "none";
}
/* CREATION DES FONCTIONS POUR SAUVEGARDER LE PLANNING DANS LE LOCAL STORAGE ET LE RECUPERER */
function savePlanning(planning) {
  localStorage.setItem("planning", JSON.stringify(planning));
}
function loadPlanning() {
  const saved = localStorage.getItem("planning");
  return saved ? JSON.parse(saved) : [];
}
/**/
function parseHtmlEntities(str) {
    return str.replace(/&#([0-9]{1,4});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); 
        return String.fromCharCode(num);
    });
}

/* THEME ENREGISTRE AU CHARGEMENT */
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

/* MISE EN PLACE DU MODE CLAIR/SOMBRE ET COOKIES POUR CETTE FEATURE */
function updateThemeIcon(theme) {
  if (theme === "dark") {
    themeIcon.src = "./assets/img/soleil_svg.svg";
    themeIcon.alt = "Icône de soleil (thème clair)";
  } else {
    themeIcon.src = "./assets/img/lune_svg.svg";
    themeIcon.alt = "Icône de lune (thème sombre)";
  }
}

function initializeTheme() {
  const savedTheme = getCookie("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

userPlanning = loadPlanning();

function renderPlanning() {
  containerFav.innerHTML = ""; 

  if (userPlanning.length === 0) {
    containerFav.innerHTML = "<p>Aucun événement dans votre planning</p>";
    return;
  }

  userPlanning.forEach((event) => {
    const card = document.createElement("div");
    card.classList.add("event-card");

    const title = document.createElement("h4");
    title.textContent = parseHtmlEntities(event.title);

    const date = document.createElement("p");
    date.textContent = event.start_date;

    const venue = document.createElement("p");
    venue.textContent = event.venue?.address
      ? `${event.venue.address} / ${event.venue.city} / ${event.venue.venue}`
      : "Pas d'adresse disponible";
    
    const detailsBtn = document.createElement("button");
    detailsBtn.classList.add("btn", "btn-details");
    detailsBtn.textContent = "Voir détails";
    detailsBtn.setAttribute("aria-label", `Voir les détails de l'évènement ${event.title}`);
    detailsBtn.addEventListener("click", () => {
      titreModal.textContent = parseHtmlEntities(event.title);
      descriptionModal.innerHTML = event.description;
      dateModal.textContent = event.start_date;

      venueModal.textContent = event.venue?.address
        ? `${event.venue.address} / ${event.venue.city} / ${event.venue.venue}`
        : "Pas d'adresse disponible";

      linkModal.href = event.url;
      linkModal.textContent = "Voir l'évènement";
      // Show modal
      overlayModal.style.display = "flex";
    });

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("btn", "btn-remove");
    removeBtn.textContent = "Retirer";
    removeBtn.setAttribute("aria-label", `Retirer l'évènement ${event.title} du planning`);
    removeBtn.addEventListener("click", () => {
      userPlanning = userPlanning.filter((e) => e.id !== event.id);
      savePlanning(userPlanning);
      renderPlanning();
    });

    const container = document.createElement("div");
    container.classList.add("btn-container");
    container.appendChild(detailsBtn);
    container.appendChild(removeBtn);

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(venue);
    card.appendChild(container);
    containerFav.appendChild(card);
  });
}

/* RECUPERATION DES DONNEES VIA L'API */
async function fetchData() {
  const apiUrl = "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events";
  try {
    const response = await fetch(apiUrl);
    // Status 200 == OK
    if (response.status === 200) {
      console.log("Données récupérées avec succès");
    }

    const data = await response.json();
    data.events.forEach((event) => {
      /* CREATION A LA VOLEE DES CARTES EVENEMENTS */
      /* STRUCTURE */
      const div = document.createElement("div");
      div.classList.add("event-card");
      const title = document.createElement("h4");
      const date = document.createElement("p");
      const lieu = document.createElement("p");
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("btn-container");
      const buttonDetails = document.createElement("button");
      buttonDetails.classList.add("btn", "btn-details");
      const buttonAdd = document.createElement("button");
      buttonAdd.classList.add("btn", "btn-add");
      title.textContent = parseHtmlEntities(event.title);
      date.textContent = event.start_date;
      buttonDetails.textContent = "Voir détails";
      buttonAdd.textContent = "Ajouter";
      buttonDetails.setAttribute("aria-label", `Voir les détails de l'évènement ${event.title}`);
      buttonAdd.setAttribute("aria-label", `Ajouter l'évènement ${event.title} au planning`);

      if (event.venue != "" && event.venue != null)  {
        lieu.textContent = `${event.venue.address} / ${event.venue.city} / ${event.venue.venue}`;
      } else {
        lieu.textContent = "Pas d'adresse disponible";
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
        titreModal.textContent = parseHtmlEntities(event.title);
        descriptionModal.innerHTML = event.description;
        dateModal.textContent = event.start_date;

        if (event.venue != "" && event.venue != null)  {
          venueModal.textContent = `${event.venue.address} / ${event.venue.city} / ${event.venue.venue}`;
        } else {
          venueModal.textContent = "Pas d'adresse disponible";
        }
        linkModal.href = event.url;
        linkModal.textContent = "Clique ici pour voir l'évènement";
        overlayModal.style.display = "flex";
      });
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

overlayModal.addEventListener("click", closeModal);
buttonCloseModal.addEventListener("click", closeModal);
themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  setCookie("theme", newTheme, 365);
  updateThemeIcon(newTheme);
});

initializeTheme();
fetchData();
renderPlanning();
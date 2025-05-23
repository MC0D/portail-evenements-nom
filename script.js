/* RECUPERATION DES ID POUR LES SECTIONS */

const body = document.body;
const events = document.getElementById("events");
const planning = document.getElementById("planning");

/* RECUPERATION DES ID POUR LA MODALE */

const divModal = document.getElementById("modal");
const buttonCloseModal = document.getElementById("close-modal");
const titreModal = document.getElementById("modal-title");
const descriptionModal = document.getElementById("modal-description");
const dateModal = document.getElementById("modal-date");
const venueModal = document.getElementById("modal-venue");
const linkModal = document.getElementById("modal-link");


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
    console.log(data);
    
    dataEvents = data.events;
    dataEvents.forEach((event) => {
      /* CREATION A LA VOLEE DES CARTES EVENEMENTS */
      /* STRUCTURE */
      const div = document.createElement("div");
      const title = document.createElement("h4");
      const date = document.createElement("p");
      const lieu = document.createElement("p")
      const buttonDetails = document.createElement("button");
      const buttonAdd = document.createElement("button");
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
      div.appendChild(buttonDetails);
      div.appendChild(buttonAdd);
      events.appendChild(div);

      /* EVENEMENTS SUR LES BOUTONS */
      /* BOUTON DETAILS */
      buttonDetails.addEventListener("click", () => {
        titreModal.textContent = event.title;
        descriptionModal.textContent = event.description;
        dateModal.textContent = event.date;
        venueModal.textContent = `${event.venue.address} / ${event.venue.city}
      / ${event.venue.venue}`;
        linkModal.href = event.url;
        linkModal.textContent = "Voir l'évènement";
        divModal.classList.remove("hidden");
      })
      buttonAdd.addEventListener("click", () => {
        console.log(`Ajouté au planning : ${event.title}`);
  });
    });
  } catch {
    console.log("erreur lors de la récupérations des données");
  }
}
fetchData()

buttonCloseModal.addEventListener("click", () => {
  divModal.classList.add("hidden");
})
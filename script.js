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
    console.log(dataEvents);
    dataEvents.forEach((event) => {
      console.log(event.title);
      console.log(event.description);
      console.log(event.date);
      console.log(event.venue.city);
    });
  } catch {
    console.log("erreur lors de la récupérations des données");
  }
}
fetchData();

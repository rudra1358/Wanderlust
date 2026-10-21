const mapContainer = document.getElementById("map");

if (mapContainer) {
  const coordinates = JSON.parse(mapContainer.dataset.coordinates || "null");
  const mapToken = mapContainer.dataset.mapToken;
  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[character];
    });

  if (!mapToken) {
    console.error("Mapbox access token is not configured.");
    mapContainer.textContent = "Map is unavailable: access token is missing.";
  } else if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    !coordinates.every(Number.isFinite)
  ) {
    mapContainer.textContent = "Map location is unavailable.";
  } else {
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/standard",
      zoom: 12,
      center: coordinates,
    });

    const popup = new mapboxgl.Popup({
      offset: 25,
      focusAfterOpen: false,
    }).setHTML(
      `<h4>${escapeHtml(mapContainer.dataset.listingTitle || "")}</h4><p>Exact location will be provided after booking!</p>`,
    );
    const marker = new mapboxgl.Marker({ color: "black" })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);

    marker.togglePopup();
  }
}

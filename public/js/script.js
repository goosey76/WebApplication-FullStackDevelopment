//====================================
//=== festgelegte Benutzer & Daten ===
//====================================

let currentUser = null;
let currentEditLocationId = null;

// Standorte aus dem HTML
let LOCATION = [] // starte mit leerem array

/**
 *Fetch Locations von der MongoDB
 */
async function fetchLocations() {
  try {
    const response = await fetch('/loc');
    if (response.ok) {
      LOCATION = await response.json();
      console.log("Locations loaded:", LOCATION.length);
      return LOCATION;
    } else {
      console.error("Fehler beim Laden der Locations", response.status);
      return [];
    }
  } catch (err) {
    console.error("Fehler beim Laden der Locations:", err);
  }
}

//==================
//=== Funktionen ===
//==================

/**
 * LogIn Handling von Admin und Normalo
 * @param {*} e
 */
function handleLogin(e) {
  console.log("==== Login Debug Start ====")
  console.log("Event:", e);
  console.log("Event type:", e ? e.type : 'no event');

  // Verhindert Neu Laden der Seite
  e.preventDefault();

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  console.log("username input:", usernameInput);
  console.log("password input:", passwordInput);

if (!usernameInput || !passwordInput) {
    console.error("Input elements not found!");
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  console.log("username value:", username);
  console.log("password value:", password);

  console.log("Trying to login:", username, password)

  console.log("About to fetch /login");
  // Mongo DB backend Aufruf
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => { // Wenn Response gültig von der Datenbank
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Login fehlgeschlagen ' + response.status);
    }
  })
  .then(user => {
    // Success Handling
    currentUser = user;
    console.log("Login erfolgreich als:", currentUser, "Role:", currentUser.role);

    showScreen("mainScreen");
    renderLocations();
    console.log('Rendering Location');

    const welcomeMessage = document.getElementById("welcomeMessage");
    if(welcomeMessage) {
      welcomeMessage.textContent = `Herzlich Willkomen, ${user.name}.`;
      welcomeMessage.classList.remove("hide");
    }

    const logoutButton = document.getElementById("logoutButton");
    if(logoutButton) {
      logoutButton.classList.remove("hide");
    }

    handleAdminVisibility(user.role);
  })
  .catch(error => {
    // Error Handling
    usernameInput.classList.add("error");
    passwordInput.classList.add("error");
    console.error("Login failed:", error);
    alert("Login fehlgeschlagen: Ungültige Anmeldeinformationen");
  })
}

/**
 *  Gibt die Sichtenbesichtigung zwischen
 *  === ADMINA und NORMALO ===
 * @param {*} role  Die Rolle des Users
 */
function handleAdminVisibility(role) {
// suche alle admin Elemente - > Hier Speichern-Löschen Button
const adminElements = document.querySelectorAll('.admin-only');

  // admin-only Klasse wird hier sichtbar gemacht
  if (role === 'admin') {
    adminElements.forEach((element) => {
      element.style.display = 'block';
    });

  } else {
    // Normalos: admin-only Klasse wird hier nicht sichtbar gemacht
    adminElements.forEach((element) => {
      element.style.display = 'none';
    });
  }
}

/**
 * Zentrale steuerung der Screens
 * @param {*} screenIdToShow Der Ausgewählte Screen
 */
function showScreen(screenIdToShow) {
  // Alle Hauptscreens der Anwendung
  const screen = [
    'loginScreen',
    'mainScreen',
    'addScreen',
    'detailScreen',
  ];

  // Alle Screens ausblenden bis auf toShow
  screen.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = (id === screenIdToShow) ? 'block' : 'none'
    }
  });
}

/**
 * called die API für Geokoordinaten (Nominatim)
 * @param {string} addressString die vollständige Adresse
 * @returns {Promise<{lat: string, lon: string} | null>}
 */
async function fetchCoordinates(addressString) {
    const baseUrl = 'https://nominatim.openstreetmap.org/search';

    const params = new URLSearchParams({
        q: addressString,
        format: 'json',
        limit: '1',
        addressdetails: '0'
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log('Nominatim-Request:', url);

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Nominatim HTTP-Fehler:', response.status);
            return null;
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.warn('Keine Ergebnisse für Adresse:', addressString);
            return null;
        }

        const first = data[0];
        return {
            lat: first.lat,
            lon: first.lon
        };
    } catch (err) {
        console.error('Fehler beim Abruf der Koordinaten:', err);
        return null;
    }
}

/**
 * Updated die Felder von den Standort
 * @param {*} event Bei änderung des Standortes und seine Felder
 * @returns Der Bearbeitete Standort
 */
async function handleUpdate(event) {
    event.preventDefault();

    if (!currentUser || currentUser.role !== 'admin') {
        alert("Sie haben keine Berechtigung, Standorte zu speichern oder zu aktualisieren.");
        return;
    }

    if (!currentEditLocationId) {
        alert("Es wurde kein Standort zum Speichern ausgewählt.");
        return;
    }

    const title = document.getElementById('detail-title').value;
    const description = document.getElementById('detail-description').value;
    const address = document.getElementById('detail-address').value;
    const plzCity = document.getElementById('detail-plz').value;
    const category = document.getElementById('detail-category').value;

    let lat = document.getElementById('detail-lat').value;
    let lon = document.getElementById('detail-lon').value;

    const fullAddress = `${address}, ${plzCity}`;

    const coords = await fetchCoordinates(fullAddress);
    if (coords) {
        lat = coords.lat;
        lon = coords.lon;
        document.getElementById('detail-lat').value = lat;
        document.getElementById('detail-lon').value = lon;
    } else {
        console.warn('Keine Koordinaten gefunden, lasse lat/lon unverändert.');
    }

  let image = LOCATION.find(loc => loc._id === currentEditLocationId)?.image || 'placeholder.png';

  const fileInput = document.getElementById('detail-img');
  if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
          image = e.target.result; // Data-URL
      };
      reader.readAsDataURL(file);
      // Warte auf das Laden (da async, könnte ein Promise verwendet werden, aber für Einfachheit: annehmen, dass es schnell ist)
      await new Promise(resolve => reader.onload = () => { image = reader.result; resolve(); });
  }

  const updatedData = { title, description, address, plzCity, category, lat, lon, image };

  // Updated die Daten von der Location in die Datenbank
  try {
    const response = await fetch(`/loc/${currentEditLocationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json",
      },
      body : JSON.stringify(updatedData)
    });

    if (response.ok) {
      // Refresh locations from database to ensure we have the latest data
      await fetchLocations();
      alert(`Standort ${title} erfolgreich gespeichert!`);
      currentEditLocationId = null;
      renderLocations();
      showScreen('mainScreen');
    } else {
      alert("Fehler beim Aktualisieren");
    }
  } catch (err) {
    console.error('Fehler:', err);
    alert('Netzwerkfehler');
  }
}

/**
 * Logout Button und Reset von der Form -> zum LoginScreen
 */
function handleLogout() {
  console.log("User logged out.");
  currentUser = null;

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // Wilkommens Message und Logout Button werden mit .hide versteck
  document.getElementById("welcomeMessage").classList.add("hide");
  document.getElementById("logoutButton").classList.add("hide");

  handleAdminVisibility(null);

  // Reset von LoginData
  document.getElementById("welcomeMessage").textContent = ``;
  document.getElementById("username").value = '';
  document.getElementById("password").value = '';
  usernameInput.classList.remove("error");
  passwordInput.classList.remove("error");

  showScreen("loginScreen");
}

/**
 * Standort hinzufügen Button -> AddScreen
 * @returns den addScreen oder FehlerMeldung wenn die Rolle nicht stimmt.
 */
function handleAddLocationClick() {

  // Admin Rechte überprüfen zum Speichern
  if (!currentUser || currentUser.role !== 'admin') {
      alert("Sie haben keine Berechtigung, Standorte zu speichern oder zu aktualisieren.");
      return;
  }

  renderLocations();
  showScreen('addScreen');
}

/**
 * Geht wieder zum Mainscreen
 */
function handleCancel() {
  showScreen('mainScreen');
}

/**
 * Rendert die Location in die HTML Cards
 * und hält das Array an Standorten aktuell
 */
function renderLocations() {
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = '';

    LOCATION.forEach(location => {
        const card = document.createElement('article');
        card.className = 'location-card';
        card.id = `location-${location._id}`;

        card.innerHTML = `
          <h3 class="location-title">${location.title}</h3>
          <div class="location-meta">
          <p><strong>Adresse:</strong> ${location.address}, ${location.plzCity}</p>
          <p><strong>Kategorie:</strong> ${location.category}</p>
          <div class="list-img">
            <img src="${location.image}" alt="Kein Bild vorhanden.">
        </div>
      </div>
    `;

        // Add click event for details
        card.addEventListener('click', () => {
            currentEditLocationId = location._id;
            showScreen('detailScreen');

            document.getElementById('detail-title').value = location.title;
            document.getElementById('detail-description').value = location.description;
            document.getElementById('detail-address').value = location.address;
            document.getElementById('detail-plz').value = location.plzCity;
            document.getElementById('detail-category').value = location.category;
            document.getElementById('previewImage').src = location.image;

            document.getElementById('detail-lat').value = location.lat || '';
            document.getElementById('detail-lon').value = location.lon || '';

            // Admin / Non-Admin
            const detailInputs = document.querySelectorAll('#detailScreen input, #detailScreen select');

            const latField = document.getElementById('detail-lat');
            const lonField = document.getElementById('detail-lon');

            if (currentUser && currentUser.role === 'admin') {
                detailInputs.forEach(input => {
                    input.disabled = false;
                    input.readOnly = false;
                });
            } else {
                detailInputs.forEach(input => {
                    input.disabled = true;
                    input.readOnly = true;
                });
            }
            latField.disabled = true;
            latField.readOnly = true;
            lonField.disabled = true;
            lonField.readOnly = true;

        });

        locationList.appendChild(card);
    });
}

/**
 * fügt den neuen Standort in die Liste hinzu und aktuallisiert die MainPage
 * Diese Soll POST /loc nutzen
 * @param {*} event Beim zufuegen des Standortes
 * @returns die neue Liste
 */
async function handleAddLocation(event) {
    event.preventDefault();

    if (!currentUser || currentUser.role !== 'admin') {
        alert('Keine Berechtigung');
        return;
    }

    const title = document.getElementById('titel').value;
    const description = document.getElementById('standort').value;
    const street = document.getElementById('street+number').value;
    const plzCity = document.getElementById('plzStadt').value;
    const category = document.getElementById('category-select').value;

    const fullAddress = `${street}, ${plzCity}`;

    const coords = await fetchCoordinates(fullAddress);

    let lat = '';
    let lon = '';

    if (coords) {
        lat = coords.lat;
        lon = coords.lon;

        const latInput = document.getElementById('breitenGrad');
        const lonInput = document.getElementById('laengenGrad');
        if (latInput) latInput.value = lat;
        if (lonInput) lonInput.value = lon;
    } else {
        console.warn('Keine Koordinaten gefunden, speichere ohne lat/lon.');
    }

  let image = 'placeholder.png'; // Fallback

  const fileInput = document.getElementById('standortBild');
  if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
          image = e.target.result; // Data-URL
      };
      reader.readAsDataURL(file);
      // Warte auf das Laden (da async, könnte ein Promise verwendet werden, aber für Einfachheit: annehmen, dass es schnell ist)
      await new Promise(resolve => reader.onload = () => { image = reader.result; resolve(); });
  }

  const newLocation = {
      id: Math.max(...LOCATION.map(l => l.id), 0) + 1,
      title,
      description,
      address: street,
      plzCity,
      category,
      image,
      lat,
      lon
  };

  // Instead Of Location push. wird post verwendet
  // LOCATION.push(newLocation);
  try {
    const response = await fetch('/loc', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(newLocation)
    });

    if (response.ok) {
      const result = await response.json();
      newLocation._id = result.id; // Fügt die neue Id hinzu
      LOCATION.push(newLocation);
      renderLocations();
      showScreen('mainScreen');
    } else {
      alert('Fehler beim Speichern des Standortes');
      console.error('Fehler:', err);
      alert('Netzwerkfehler');
    }
  } catch (err) {
    console.error ('Fehler:', err);
    alert('Netzwerkfehler');
  }

  event.target.reset();
}

/**
 * Admina darf: Standorte anlegen, existierende Standorte
 *              löschen und bearbeiten
 * Normalo darf:sich alle Standorte angucken,
 *              aber nicht löschen oder bearbeiten
 *              darf diese weder bearbeiten noch
 *              löschen. ‚normalo‘ darf keine Standorte anlegen
 */
document.addEventListener("DOMContentLoaded", async () => {
    console.log("=== DOM CONTENT LOADED ===");

    // Lade Die Locations als erstes
    await fetchLocations();
    renderLocations();

    // Login Form und Handling.
    const loginForm = document.getElementById("loginForm");
    console.log("loginForm element:", loginForm);
    if(loginForm) {
      loginForm.addEventListener("submit", handleLogin);
      console.log("Login event listener attached successfully!");
    } else {
      console.error("loginForm form not found! Cannot attach event listener");
    }

    // logout and reset
    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", handleLogout);
    }

    // Update Eventhandler für das Speichern vom Bereits bestehenden Locations Button
    const detailsForm = document.getElementById('detailsForm');
    if(detailsForm) {
      detailsForm.addEventListener('submit', handleUpdate);
    }

    // Adminas Hinzufuegen eines neuen Standortes- Add-Button
    const addButton = document.getElementById("add-btn");
    if (addButton) {
      addButton.addEventListener("click", handleAddLocationClick);
    }

    const addForm = document.querySelector('#addScreen form');
    if(addForm) {
      addForm.addEventListener('submit', handleAddLocation);
    }

    // Cancel Button vom Add-Button
    const cancelAddButton = document.getElementById("cancel-add-btn");
    if (cancelAddButton) {
        cancelAddButton.addEventListener("click", handleCancel);
    }

    // Cancel button vom DetailsScreen
    const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
        cancelButton.addEventListener("click", handleCancel);
    }

    // delete Button
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
      deleteButton.addEventListener('click', async (e) => {
        // Admin Rechte überprüfen zum Speichern
        if (!currentUser || currentUser.role !== 'admin') {
            alert("Sie haben keine Berechtigung, Standorte zu speichern oder zu aktualisieren.");
            return;
        }

        try {
          // Lösche aus der Datenbank
          const response = await fetch(`/loc/${currentEditLocationId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            // Wenn erfolgreich gelöscht, aktualisiere die Liste
            await fetchLocations();
            renderLocations();
            showScreen('mainScreen');
            currentEditLocationId = null;
            alert('Standort erfolgreich gelöscht!');
          } else {
            alert('Fehler beim Löschen des Standortes');
          }
        } catch (err) {
          console.error('Fehler beim Löschen:', err);
          alert('Netzwerkfehler beim Löschen');
        }
      });
    }
});

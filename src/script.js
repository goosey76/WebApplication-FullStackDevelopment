//====================================
//=== festgelegte Benutzer & Daten ===
//====================================

// Vorgelegte Benutzer
const USER = [
  { username:"admina", password:"password", role:"admin", name:"Mina" },
  { username:"normalo", password:"password", role:"non-admin", name:"Norman" }
]

let currentUser = null;
let currentEditLocationId = null;

// Standorte aus dem HTML
const LOCATION = [
{ id: 1, title:"Blockierter Radweg an der HTW", description:"Hier ist ein Radweg blockiert.", address:"Ostendstr. 35", plzCity:"12459, Berlin", category: "Fahrrad", image:"img/ostend.png"},
{ id: 2, title:"Radweg endet auf enger Straße", description:"Hier endet ein Radweg im nirgendwo.", address:"Roelckestr. 69", plzCity:"13086, Berlin", category: "Fahrrad", image:"img/roelcke.png"},
{ id: 3, title:"Ersatzverkehr in Marzahn", description:"Hier ist Ersatzverkehr mit Bussen.", address:"S Marzhan", plzCity:"12679, Berlin", category: "ÖPNV", image:"placeholder.png"},];


//===================
//=== Funktionen ===
//==================

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
 * Updated die Felder von den Standort
 * @param {*} event Bei änderung des Standortes und seine Felder
 * @returns Der Bearbeitete Standort
 */
function handleUpdate(event) {
  event.preventDefault(); // verhindert Seiten Logout

  // Admin Rechte überprüfen auf Updates
  if (!currentUser || currentUser.role !== 'admin') {
      alert("Sie haben keine Berechtigung, Standorte zu speichern oder zu aktualisieren.");
      return;
  }

  if(!currentEditLocationId) {
    alert("Es wurde kein Standort zum Speichern ausgewählt.");
    return;
  }

  // 1. Daten aus den Detailfeldern holen
  const updatedData = {
      title: document.getElementById('detail-title').value,
      description: document.getElementById('detail-description').value,
      address: document.getElementById('detail-address').value,
      plzCity: document.getElementById('detail-plz').value,
      category: document.getElementById('detail-category').value,
      lat: document.getElementById('detail-lat').value,
      lon: document.getElementById('detail-lon').value,
      
  };

  // 2. Im Array aktualisieren
  const index = LOCATION.findIndex(loc => loc.id === currentEditLocationId);
  if (index !== -1) {
      LOCATION[index] = { ...LOCATION[index], ...updatedData };
      alert(`Standort ${updatedData.title} erfolgreich gespeichert!`);
  }

  // 3. Zurück zur Hauptansicht
  currentEditLocationId = null;
  
  // Todo: Locations müssten auf Main aktuallisiert werden bei erweiterten Location Arrays erweiterte Card List
  renderLocations();
  showScreen('mainScreen');
}

/**
 * LogIn Handling von Admin und Normalo
 * @param {*} e 
 */
function handleLogin(e) {
  e.preventDefault();

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  usernameInput.classList.remove("error");
  passwordInput.classList.remove("error");

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Findet denn Nuzer
  const foundUser = USER.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    currentUser = foundUser;
    console.log("Login erfolgreich als:", foundUser.name, "Role:", foundUser.role);

    // MainScreen beim Login
    showScreen("mainScreen");
    renderLocations();
    console.log('Rendering Location');

    // Wilkommen und Logout Button sichtbar machen (sind keine Screens)
    const welcomeMessage = document.getElementById("welcomeMessage");
    if(welcomeMessage) {
      welcomeMessage.textContent = `Herzlich Willkomen, ${foundUser.name}.`;
      welcomeMessage.classList.remove("hide"); 
    }

    const logoutButton = document.getElementById("logoutButton");
    if(logoutButton) {
      logoutButton.classList.remove("hide"); 
    }

    // Admin Buttons
    handleAdminVisibility(foundUser.role);

  } else {
    usernameInput.classList.add("error");
    passwordInput.classList.add("error");
    console.log("User not found: Invalid username or password.");
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
  locationList.innerHTML = ''; // cleaned

  LOCATION.forEach(location => {
    const card = document.createElement('article');
    card.className = 'location-card';
    card.id = `location-${location.id}`;

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
      currentEditLocationId = location.id;
      showScreen('detailScreen');
      // Fill details (reuse existing logic)
      document.getElementById('detail-title').value = location.title;
      document.getElementById('detail-description').value = location.description;
      document.getElementById('detail-address').value = location.address;
      document.getElementById('detail-plz').value = location.plzCity;
      document.getElementById('detail-category').value = location.category;
      document.getElementById('previewImage').src = location.image;
      // Handle admin/non-admin view (reuse existing logic)
      const detailInputs = document.querySelectorAll('#detailScreen input, #detailScreen select');
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
    });

    locationList.appendChild(card);
  });
}

/**
 * fügt den neuen Standort in die Liste hinzu und aktuallisiert die MainPage
 * @param {*} event Beim zufuegen des Standortes
 * @returns die neue Liste
 */
function handleAddLocation(event) {
  event.preventDefault();
  if(!currentUser || currentUser.role != 'admin') {
    alert('Keine Berechtigung');
    return;
  }

  // Neuer Standort +1 in der Liste
  const newLocation = {
    id: Math.max(...LOCATION.map(l => l.id), 0) + 1,
    title: document.getElementById('titel').value,
    description: document.getElementById('standort').value,
    adress: document.getElementById('street+number').value,
    plzCity: document.getElementById('plzStadt').value,
    category: document.getElementById('category-select').value,
    image: 'placeholder.png'
  };
  LOCATION.push(newLocation);
  renderLocations();

  event.target.reset();
  showScreen('mainScreen');
}


  /**
   * Admina darf: Standorte anlegen, existierende Standorte
   *              löschen und bearbeiten
   * Normalo darf:sich alle Standorte angucken,
   *              aber nicht löschen oder bearbeiten
   *              darf diese weder bearbeiten noch
   *              löschen. ‚normalo‘ darf keine Standorte anlegen
   */
  document.addEventListener("DOMContentLoaded", () => {

  // Login Form und Handling.   
  const loginForm = document.querySelector("#loginScreen form");
  if(loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // logout and reset 
  const logoutButton = document.querySelector("#logoutButton");
  if (logoutButton) { 
    logoutButton.addEventListener("click", handleLogout)
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
  deleteButton.addEventListener('click', (e) => {
    // Admin Rechte überprüfen zum Speichern
  if (!currentUser || currentUser.role !== 'admin') {
      alert("Sie haben keine Berechtigung, Standorte zu speichern oder zu aktualisieren.");
      return;
  }

  // entferne vom Array
  const index = LOCATION.findIndex(loc => loc.id === currentEditLocationId);
  if (index !== -1) {
    LOCATION.splice(index, 1);
  }

  // Renderr
  renderLocations();
  showScreen('mainScreen');
  currentEditLocationId == null;
  })

  //Details
  const locationCards = document.querySelectorAll(".location-card");
    let activeCard = null;
    locationCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const locationCardId = card.getAttribute("id");
        console.log("Opened detail-view of location: " + locationCardId);

        activeCard = card;

        currentEditLocationId = parseInt(locationCardId.replace('location-', ''));
        //hide everything else
        showScreen('detailScreen');

        //switch to admin or non-admin view
        const detailInputs = document.querySelectorAll(
          "#detailScreen input, #detailScreen select"
        );

        if (currentUser.role === "admin") {

          detailInputs.forEach((input) => {
            input.disabled = false;
            input.readOnly = false;
          });

        } else {
          detailInputs.forEach((input) => {
              input.disabled = true;
              input.readOnly = true;
          });
        }

        const titleEl = card.querySelector(".location-title");
        const title = titleEl ? titleEl.textContent.trim() : "";

        const foundLocation = LOCATION.find(
          (l) => l.title === title
        );

        //fill fields
        document.getElementById("detail-title").value = foundLocation.title;
        document.getElementById("detail-description").value = foundLocation.description;
        document.getElementById("detail-address").value = foundLocation.address;
        document.getElementById("detail-plz").value = foundLocation.plzCity;
        document.getElementById("detail-category").value = foundLocation.category;

          //fill image
        document.getElementById("previewImage").src = foundLocation.image;

        // Gehe wieder zum Main Screen
        const cancelButton = document.getElementById("cancelButton");
        cancelButton.addEventListener("click", (e) => {
          showScreen('mainScreen');
        })

        //delete

        const deleteButton = document.getElementById("deleteButton");
        deleteButton.addEventListener("click", (e) => {
            //TODO: DELETE-LOGIC
          if (!activeCard) return;

          console.log("Deleting:", activeCard.id);

          activeCard.remove();

          document.getElementById("detailScreen").style.display = "none";

          document.querySelectorAll(".hide").forEach((el) => {
            el.style.display = "block";
          });

          activeCard = null;

        })

      })

    })
  });


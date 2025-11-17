
/**
 * Admina darf: Standorte anlegen, existierende Standorte
 *              löschen und bearbeiten
 * Normalo darf:sich alle Standorte angucken,
 *              aber nicht löschen oder bearbeiten
 *              darf diese aber weder bearbeiten noch
 *              löschen. ‚normalo‘ darf keine Standorte anlegen
 */


document.addEventListener("DOMContentLoaded", () => {
  const USER = [
    { username:"admina", password:"password", role:"admin", name:"Mina" },
    { username:"normalo", password:"password", role:"non-admin", name:"Norman" }
  ]

  //Login Authentication
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  let currentUser = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    usernameInput.classList.remove("error");
    passwordInput.classList.remove("error");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    //find matching user
    const foundUser = USER.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      currentUser = foundUser;
      console.log("Login erfolgreich als:", foundUser.name, "Role:", foundUser.role);

      //show hidden elements
      document.querySelectorAll(".hide").forEach((el) => {
        el.style.display = "block";
      });
      //hide login
      document.querySelectorAll(".login").forEach((el) => {
        el.style.display = "none";
      });
      //display personalized welcome message
      document.getElementById("welcomeMessage").textContent = `Hallo ${foundUser.name}.`;

      //TODO: show role-specific elements (.admin-only / .normal-only)
      if (currentUser.role === "admin") {
        document.querySelectorAll(".admin-only").forEach((el) => {
          el.style.display = "block";
        })
      } else if (currentUser.role === "non-admin") {
        document.querySelectorAll(".admin-only").forEach((el) => {
          el.style.display = "none";
        })
      }
    }

    //Errors
    if (!foundUser) {
      usernameInput.classList.add("error");
      passwordInput.classList.add("error");
      console.log("User not found: Invalid username or password.");
    }
  });

  //Logout and reset
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", (e) => {
    console.log("User logged out.");
    currentUser = null;

    //hide elements
    document.querySelectorAll(".hide").forEach((el) => {
      el.style.display = "none";
    })

    //show login
    document.querySelectorAll(".login").forEach((el) => {
      el.style.display = "block";
    })

    //reset welcome message
    document.getElementById("welcomeMessage").textContent = ``;

    //reset login-form
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
    usernameInput.classList.remove("error");
    passwordInput.classList.remove("error");
  })

  //Add
  const addButton = document.getElementById("add-btn");

  addButton.addEventListener("click", (e) => {

    //hide everything else
    document.querySelectorAll(".hide").forEach((el) => {
      el.style.display = "none";
    })

    //show-add-view
    document.getElementById("addScreen").style.display = "block";

    const cancelAddButton = document.getElementById("cancel-add-btn");
    cancelAddButton.addEventListener("click", (e) => {

      document.querySelectorAll(".hide").forEach((el) => {
        el.style.display = "block";
      })

      document.getElementById("addScreen").style.display = "none";
    })

  })

  //Details
  const locationCards = document.querySelectorAll(".location-card");

    const LOCATION = [
      { id: 1, title:"Blockierter Radweg an der HTW", description:"Hier ist ein Radweg blockiert.", address:"Ostendstr. 35", plzCity:"12459, Berlin", category: "Fahrrad", image:"img/ostend.png"},
      { id: 2, title:"Radweg endet auf enger Straße", description:"Hier endet ein Radweg im nirgendwo.", address:"Roelckestr. 69", plzCity:"13086, Berlin", category: "Fahrrad", image:"img/roelcke.png"},
      { id: 3, title:"Ersatzverkehr in Marzahn", description:"Hier ist Ersatzverkehr mit Bussen.", address:"S Marzhan", plzCity:"12679, Berlin", category: "ÖPNV", image:""}
    ]

    let activeCard = null;
    locationCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const locationCardId = card.getAttribute("id");
        console.log("Opened detail-view of location: " + locationCardId);

        activeCard = card;

        //hide everything else
        document.querySelectorAll(".hide").forEach((el) => {
          el.style.display = "none";
        })

        //show detail-view of location
        document.getElementById("detail-view").style.display = "block";

        //switch to admin or non-admin view
        const detailInputs = document.querySelectorAll(
          "#detail-view input, #detail-view select"
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
        const previewImage = document.getElementById("previewImage").src = foundLocation.image;

        const cancelButton = document.getElementById("cancelButton");
        cancelButton.addEventListener("click", (e) => {

          document.querySelectorAll(".hide").forEach((el) => {
            el.style.display = "block";
          })

          document.getElementById("detail-view").style.display = "none";
        })

        //delete

        const deleteButton = document.getElementById("deleteButton");
        deleteButton.addEventListener("click", (e) => {
           //TODO: DELETE-LOGIC
          if (!activeCard) return;

          console.log("Deleting:", activeCard.id);

          activeCard.remove();

          document.getElementById("detail-view").style.display = "none";

          document.querySelectorAll(".hide").forEach((el) => {
            el.style.display = "block";
          });

          activeCard = null;

        })

      })
    })
});




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
      if (foundUser.role === "admin") {
        document.querySelectorAll(".admin-only").forEach((el) => {
          el.style.display = "block";
        })
      } else if (foundUser.role === "non-admin") {
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

  //Details
  const locationCards = document.querySelectorAll(".location-card");

    const LOCATION = [
      { id: 1, title:"Blockierter Radweg an der HTW", description:"Hier ist ein Radweg blockiert.", address:"Ostendstr. 35", plz:"12459" , city:"Berlin", category: "Fahrrad", image:"-"},
      { id: 2, title:"Radweg endet auf enger Straße", description:"Hier endet ein Radweg im nirgendwo.", address:"Roelckestr. 69", plz:"13086" , city:"Berlin", category: "Fahrrad", image:"-"},
      { id: 3, title:"Ersatzverkehr in Marzahn", description:"Hier ist Ersatzverkehr mit Bussen.", address:"S Marzhan", plz:"12679" , city:"Berlin", category: "ÖPNV", image:"-"}
    ]

    locationCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const locationCardId = card.getAttribute("id");
        console.log("Opened detail-view of location: " + locationCardId);

        //hide everything else
        document.querySelectorAll(".hide").forEach((el) => {
          el.style.display = "none";
        })

        //show detail-view of location
        document.getElementById("detail-view").style.display = "block";

        //fill fields
        const titleEl = card.querySelector(".location-title");
        const title = titleEl ? titleEl.textContent.trim() : "";
        document.getElementById("detail-title").value = title;

        const descriptionEl = card.querySelector(".location-description");

      })
    })

});



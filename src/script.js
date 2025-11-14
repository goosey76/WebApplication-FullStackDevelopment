
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
    }

    //Errors
    if (!foundUser) {
      usernameInput.classList.add("error");
      passwordInput.classList.add("error");
      console.log("User not found: Invalid username or password.");
      return;
    }

    return;

  });
});



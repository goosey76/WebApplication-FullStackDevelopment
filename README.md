# Template für Beleg 4

## Beschreibung
Eine Projektvorlage für den 4. Beleg im Kurs "Web Application Development".
Genutzte Packages:
- Express (Node.js)
- MongoDb Driver für Node.js
Verzeichnisstrucktur:
  public/   - hier kommt Ihr Frontend-Code rein: index.html, css-Dateien, Images, Browser-JS-Code
  src/      - Backend-JS-Code 

- http://localhost:8000/ zeigt die index.html an
- http://localhost:8000/users - Beispiel für den REST-Endpoint /users

## 1) Installation der packages
npm install

## 2) Code anpassen
in src/db/mongoCRUDs.js 
Diese Konstanten mit Ihren Daten belegen
const db_user = "";
const db_pass = "";
const db_name = "";
const db_collection = "";

NICHT VERGESSEN der MONGODB-SERVER ist außerhalb der HTW nur über VPN erreichbar!

## 3) Server starten
npm start

## 4) App testen
Im Browser: 
 - http://localhost:8000/ öffnen
 - index.html aus public/ wird angezeigt, login-Funktionalität ist aber nicht implementiert
In Postman:
- GET http://localhost:8000/users

- POST http://localhost:8000/users 
mit Header:
Content-Type: applicaion/json
mit Payload:
 {"username":"admina", "password":"password"}

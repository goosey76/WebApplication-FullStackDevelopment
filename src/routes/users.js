import { Router } from 'express';
import { findAllUsers, findOneUser } from '../db/mongoCRUDs.js';

let usersRouter = Router();


// Wird bei GET http://localhost:8000/users aufgerufen
usersRouter.get('/', async function(req, res) {
  try {
    //let userDoc = await mongo_cruds.findOneUser("admina", "pass1234");
    let users = await findAllUsers();
    if(users) {
      res.status(200).json(users);
    }
    else {
      res.status(401).send(`Users not found!`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internet Fehler");
  }
});


// Wird bei  
// POST http://localhost:8000/users mit payload 
// {"username":"xyz", "password":"zyx"}
// erwartet eine payload diesen ^^^ Formats 
// der Header Content-Type: application/json MUSS mitgeschickt
// 
usersRouter.post('/', async function(req, res) {
  const { username, password } = req.body;  

  try {
    const user = await findOneUser(username, password);
    
    if (user) {
      res.status(200).json(user); // Gibt den User zurück
    } else {
      res.status(401).send("Ungültige Anmeldeinformationen");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Interner Server Fehler.")
  }
});

export default usersRouter;

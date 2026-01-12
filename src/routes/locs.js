import { Router } from 'express';
import { deleteOneLocation, findAllLocations, findOneLocation } from '../db/mongoCRUDs.js'

let locationsRouter = Router();

// Finde alle Locations
locationsRouter.get('/locs', async function (req, res) {
    try {
        let locations = await findAllLocations();
        if (locations) {
            res.status(200).json(locations);
        } else {
            res.status(404).send('Locations nicht gefunden!');
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Etwas ist nicht richtig mit den Locations!!")
    }
})

// Finde eine Location
locationsRouter.get('/locs/:id', async function(req, res) {
    try {
        const locationId = req.params.id;
        let location = await findOneLocation(locationId);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).send(`Location mit ID ${locationId} nicht gefunden!`)
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Etwas ist nicht richtig mit der Location Aufruf!")
    }
});

// Lösche eine Location
locationsRouter.delete('/locs/:id', async function(req, res) {
    try {
        const locationId = req.params.id;
        let location = await deleteOneLocation(locationId); 
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(400).send(`Location mit ID ${locationId} nicht gefunden!`);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Etwas is nicht richtig mit der Location Löschen!");
    }
});

export default locationsRouter;
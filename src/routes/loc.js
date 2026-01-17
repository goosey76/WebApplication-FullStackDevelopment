import { Router } from 'express';
import { addOneLocation, deleteOneLocation, findAllLocations, findOneLocation, updateOneLocation } from '../db/mongoCRUDs.js'

let locationsRouter = Router();

/**
 * Update One Location
 */
locationsRouter.put('/:id', async function(req, res) {
    try {
        const locationId = req.params.id; // Get Id von der URL
        const updatedData = req.body; // Get updated - Data vom payload

        let result = await updateOneLocation(locationId, updatedData);
        
        if (result === 1) {
            res.status(204).send(); // Erfolgereicher Update.
        } else {
            res.status(404).send(`Location mit ID ${locationId} nicht gefunden!`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Interner Server Fehler, beim Update von einer Location");    }
})

/**
 * Füge eine Location mit LocationHeader
 */
locationsRouter.post('/', async function (req, res) {
    try {
        const locationData = req.body; // Location data without ID
        let newLocations = await addOneLocation(locationData);

        res.status(201)
        .set('Location', `/loc/${newLocations._id}`)
        .json({ id: newLocations._id }); // Gibt 201 und die neue Location
    } catch (err) {
        console.log(err)
        res.status(500).send("Interner Server Fehler");
    }
});


// Finde alle Locations
locationsRouter.get('/', async function (req, res) {
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
locationsRouter.get('/:id', async function(req, res) {
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
locationsRouter.delete('/:id', async function(req, res) {
    try {
        const locationId = req.params.id;
        let location = await deleteOneLocation(locationId); 
        if (location) {
            res.status(204).json(location);
        } else {
            res.status(400).send(`Location mit ID ${locationId} nicht gefunden!`);
        
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Etwas is nicht richtig mit der Location Löschen!");
    }
});

export default locationsRouter;
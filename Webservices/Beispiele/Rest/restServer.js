const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Swagger Definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kontakte API',
            version: '1.0.0',
            description: 'Eine REST API für die Verwaltung von Kontakten',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Entwicklungsserver'
            }
        ]
    },
    apis: ['./restServer.js'] // Pfad zu den API-Routen
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Die ID des Kontakts
 *         firstName:
 *           type: string
 *           description: Der Vorname des Kontakts
 *         lastName:
 *           type: string
 *           description: Der Nachname des Kontakts
 *         email:
 *           type: string
 *           format: email
 *           description: Die E-Mail-Adresse des Kontakts
 *         phone:
 *           type: string
 *           description: Die Telefonnummer des Kontakts
 *       example:
 *         id: 1
 *         firstName: Max
 *         lastName: Mustermann
 *         email: max@example.com
 *         phone: "+49123456789"
 */

// Beispieldaten
let contacts = [
    { id: 1, firstName: "Max", lastName: "Mustermann", email: "max@example.com", phone: "+49123456789" },
    { id: 2, firstName: "Erika", lastName: "Musterfrau", email: "erika@example.com", phone: "+49987654321" }
];

// Hilfsfunktionen
const validateContact = (contact) => {
    const errors = [];
    if (!contact.firstName) errors.push("firstName ist erforderlich");
    if (!contact.lastName) errors.push("lastName ist erforderlich");
    if (!contact.email) errors.push("email ist erforderlich");
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        errors.push("Ungültiges Email-Format");
    }
    return errors;
};

const addHATEOASLinks = (contact, req) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/api/v1`;
    return {
        ...contact,
        _links: {
            self: `${baseUrl}/contacts/${contact.id}`,
            collection: `${baseUrl}/contacts`
        }
    };
};

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Gibt eine Liste aller Kontakte zurück
 *     description: Ruft alle Kontakte ab mit optionaler Paginierung und Filterung
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Die Seitennummer für die Paginierung
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Anzahl der Einträge pro Seite
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filter nach Nachname
 *     responses:
 *       200:
 *         description: Eine Liste von Kontakten
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
app.get('/api/v1/contacts', (req, res) => {
    try {
        let result = [...contacts];
        
        // Filterung
        if (req.query.lastName) {
            result = result.filter(c => 
                c.lastName.toLowerCase().includes(req.query.lastName.toLowerCase())
            );
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        const paginatedResult = {
            data: result.slice(startIndex, endIndex).map(contact => 
                addHATEOASLinks(contact, req)
            ),
            pagination: {
                total: result.length,
                page,
                limit,
                pages: Math.ceil(result.length / limit)
            }
        };

        res.json(paginatedResult);
    } catch (error) {
        res.status(500).json({ 
            error: "Interner Serverfehler",
            message: error.message 
        });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Einen einzelnen Kontakt abrufen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des Kontakts
 *     responses:
 *       200:
 *         description: Der angeforderte Kontakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Kontakt nicht gefunden
 */
app.get('/api/v1/contacts/:id', (req, res) => {
    try {
        const contact = contacts.find(c => c.id === parseInt(req.params.id));
        if (!contact) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `Kontakt mit ID ${req.params.id} wurde nicht gefunden` 
            });
        }
        res.json(addHATEOASLinks(contact, req));
    } catch (error) {
        res.status(500).json({ 
            error: "Interner Serverfehler",
            message: error.message 
        });
    }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Einen neuen Kontakt erstellen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Der erstellte Kontakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Validierungsfehler
 */
app.post('/api/v1/contacts', (req, res) => {
    try {
        const errors = validateContact(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: "Validierungsfehler",
                messages: errors 
            });
        }

        const newContact = {
            id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
            ...req.body
        };
        
        contacts.push(newContact);
        res.status(201).json(addHATEOASLinks(newContact, req));
    } catch (error) {
        res.status(500).json({ 
            error: "Interner Serverfehler",
            message: error.message 
        });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Einen Kontakt vollständig aktualisieren
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des zu aktualisierenden Kontakts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Der aktualisierte Kontakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Kontakt nicht gefunden
 *       400:
 *         description: Validierungsfehler
 */
app.put('/api/v1/contacts/:id', (req, res) => {
    try {
        const errors = validateContact(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: "Validierungsfehler",
                messages: errors 
            });
        }

        const index = contacts.findIndex(c => c.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `Kontakt mit ID ${req.params.id} wurde nicht gefunden` 
            });
        }

        contacts[index] = { 
            ...req.body,
            id: parseInt(req.params.id)
        };

        res.json(addHATEOASLinks(contacts[index], req));
    } catch (error) {
        res.status(500).json({ 
            error: "Interner Serverfehler",
            message: error.message 
        });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Einen Kontakt teilweise aktualisieren
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des zu aktualisierenden Kontakts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Der aktualisierte Kontakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Kontakt nicht gefunden
 *       400:
 *         description: Validierungsfehler
 */
app.patch('/api/v1/contacts/:id', (req, res) => {
    try {
        const index = contacts.findIndex(c => c.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `Kontakt mit ID ${req.params.id} wurde nicht gefunden` 
            });
        }

        // Nur übergebene Felder aktualisieren
        contacts[index] = { 
            ...contacts[index],
            ...req.body,
            id: parseInt(req.params.id)
        };

        // Validierung nach Update
        const errors = validateContact(contacts[index]);
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: "Validierungsfehler",
                messages: errors 
            });
        }

        res.json(addHATEOASLinks(contacts[index], req));
    } catch (error) {
        res.status(500).json({ 
            error: "Interner Serverfehler",
            message: error.message 
        });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Einen Kontakt löschen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Die ID des zu löschenden Kontakts
 *     responses:
 *       204:
 *         description: Kontakt erfolgreich gelöscht
 *       404:
 *         description: Kontakt nicht gefunden
 */
app.delete('/api/v1/contacts/:id', (req, res) => {
    try {
        const index = contacts.findIndex(c => c.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `Kontakt mit ID ${req.params.id} wurde nicht gefunden` 
            });
        }

        contacts.splice(index, 1);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ 
            error: "Interner Serverfehler",
            message: error.message 
        });
    }
});

// HEAD /api/v1/contacts - Metadaten der Kontakte abrufen
app.head('/api/v1/contacts', (req, res) => {
    res.set('X-Total-Count', contacts.length.toString());
    res.set('X-API-Version', '1.0');
    res.send();
});

// OPTIONS /api/v1/contacts - Verfügbare HTTP-Methoden anzeigen
app.options('/api/v1/contacts', (req, res) => {
    res.set('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.status(204).send();
});

// Fehlerbehandlung für nicht existierende Routen
app.use((req, res) => {
    res.status(404).json({ 
        error: "Not Found",
        message: "Die angeforderte Route existiert nicht" 
    });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`REST-API läuft auf http://localhost:${PORT}`);
    console.log('API-Dokumentation verfügbar unter: http://localhost:${PORT}/api-docs');
    console.log('Verfügbare Endpunkte:');
    console.log('GET     /api/v1/contacts');
    console.log('GET     /api/v1/contacts/:id');
    console.log('POST    /api/v1/contacts');
    console.log('PUT     /api/v1/contacts/:id');
    console.log('PATCH   /api/v1/contacts/:id');
    console.log('DELETE  /api/v1/contacts/:id');
    console.log('HEAD    /api/v1/contacts');
    console.log('OPTIONS /api/v1/contacts');
});

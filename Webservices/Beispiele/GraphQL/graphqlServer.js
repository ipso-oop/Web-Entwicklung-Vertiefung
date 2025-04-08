const { ApolloServer, gql, UserInputError } = require('apollo-server');

const typeDefs = gql`
  """
  Repräsentiert einen Kontakt im System.
  Jeder Kontakt hat eine eindeutige ID und Pflichtfelder für die grundlegenden Informationen.
  Zusätzlich werden Zeitstempel für Erstellung und letzte Aktualisierung gespeichert.
  """
  type Contact {
    """
    Eindeutige Identifikationsnummer des Kontakts.
    Wird automatisch beim Erstellen generiert.
    """
    id: ID!

    """
    Vorname des Kontakts.
    Darf nicht leer sein.
    """
    firstName: String!

    """
    Nachname des Kontakts.
    Darf nicht leer sein.
    """
    lastName: String!

    """
    E-Mail-Adresse des Kontakts.
    Muss ein gültiges E-Mail-Format haben und eindeutig sein.
    """
    email: String!

    """
    Zeitstempel der Erstellung des Kontakts.
    Wird automatisch beim Erstellen gesetzt.
    Format: ISO 8601 Datum-Zeit-String
    """
    createdAt: String!

    """
    Zeitstempel der letzten Aktualisierung.
    Wird bei jeder Änderung automatisch aktualisiert.
    Ist null, wenn der Kontakt noch nie aktualisiert wurde.
    Format: ISO 8601 Datum-Zeit-String
    """
    updatedAt: String
  }

  """
  Input-Typ für das Erstellen eines neuen Kontakts.
  Alle Felder sind Pflichtfelder und werden validiert.
  """
  input CreateContactInput {
    """
    Vorname des neuen Kontakts.
    Darf nicht leer sein.
    """
    firstName: String!

    """
    Nachname des neuen Kontakts.
    Darf nicht leer sein.
    """
    lastName: String!

    """
    E-Mail-Adresse des neuen Kontakts.
    Muss ein gültiges E-Mail-Format haben.
    Muss eindeutig sein (darf noch nicht verwendet werden).
    """
    email: String!
  }

  """
  Input-Typ für das Aktualisieren eines bestehenden Kontakts.
  Alle Felder sind optional, nur angegebene Felder werden aktualisiert.
  """
  input UpdateContactInput {
    """
    Neuer Vorname des Kontakts.
    Optional - wenn nicht angegeben, bleibt der alte Wert bestehen.
    """
    firstName: String

    """
    Neuer Nachname des Kontakts.
    Optional - wenn nicht angegeben, bleibt der alte Wert bestehen.
    """
    lastName: String

    """
    Neue E-Mail-Adresse des Kontakts.
    Optional - wenn nicht angegeben, bleibt der alte Wert bestehen.
    Muss ein gültiges E-Mail-Format haben und eindeutig sein.
    """
    email: String
  }

  """
  Input-Typ für Pagination-Parameter.
  Ermöglicht das seitenweise Abrufen von Kontakten.
  """
  input PaginationInput {
    """
    Anzahl der zu überspringenden Einträge.
    Standard ist 0 (erste Seite).
    """
    offset: Int = 0

    """
    Maximale Anzahl der zurückzugebenden Einträge.
    Standard ist 10 Einträge pro Seite.
    """
    limit: Int = 10
  }

  """
  Typ für paginierte Kontakt-Responses.
  Enthält die Kontakte der aktuellen Seite sowie Metadaten.
  """
  type PaginatedContacts {
    """
    Liste der Kontakte für die aktuelle Seite.
    """
    contacts: [Contact]!

    """
    Gesamtanzahl aller verfügbaren Kontakte.
    """
    total: Int!

    """
    Gibt an, ob es weitere Seiten gibt.
    True wenn offset + limit < total.
    """
    hasMore: Boolean!
  }

  """
  Query-Typ definiert alle verfügbaren Leseoperationen.
  """
  type Query {
    """
    Gibt eine paginierte Liste aller Kontakte zurück.
    
    @param pagination Optional. Steuerung der Paginierung.
    @returns PaginatedContacts mit Kontaktliste und Metadaten.
    """
    contacts(pagination: PaginationInput): PaginatedContacts!
    
    """
    Findet einen einzelnen Kontakt anhand seiner ID.
    
    @param id Die ID des gesuchten Kontakts.
    @returns Den gefundenen Kontakt oder null wenn nicht gefunden.
    @throws UserInputError wenn die ID nicht existiert.
    """
    contact(id: ID!): Contact
  }

  """
  Mutation-Typ definiert alle verfügbaren Schreiboperationen.
  """
  type Mutation {
    """
    Erstellt einen neuen Kontakt.
    
    @param input CreateContactInput mit den Daten des neuen Kontakts.
    @returns Den erstellten Kontakt mit generierter ID und Timestamps.
    @throws UserInputError bei ungültiger Email oder Duplikat.
    """
    createContact(input: CreateContactInput!): Contact!

    """
    Aktualisiert einen bestehenden Kontakt.
    
    @param id ID des zu aktualisierenden Kontakts.
    @param input UpdateContactInput mit den zu ändernden Feldern.
    @returns Den aktualisierten Kontakt.
    @throws UserInputError wenn ID nicht existiert oder bei ungültigen Daten.
    """
    updateContact(id: ID!, input: UpdateContactInput!): Contact!

    """
    Löscht einen Kontakt.
    
    @param id ID des zu löschenden Kontakts.
    @returns true wenn erfolgreich gelöscht, false wenn nicht gefunden.
    @throws UserInputError wenn ID nicht existiert.
    """
    deleteContact(id: ID!): Boolean!
  }
`;

let contacts = [
  { 
    id: "1", 
    firstName: "Max", 
    lastName: "Mustermann", 
    email: "max@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: null
  },
  { 
    id: "2", 
    firstName: "Erika", 
    lastName: "Musterfrau", 
    email: "erika@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: null
  }
];

// Email Validierung
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new UserInputError('Ungültige Email-Adresse');
  }
};

const resolvers = {
  Query: {
    contacts: (_, { pagination = { offset: 0, limit: 10 } }) => {
      const { offset, limit } = pagination;
      const paginatedContacts = contacts.slice(offset, offset + limit);
      return {
        contacts: paginatedContacts,
        total: contacts.length,
        hasMore: offset + limit < contacts.length
      };
    },
    contact: (_, { id }) => {
      const contact = contacts.find(c => c.id === id);
      if (!contact) {
        throw new UserInputError('Kontakt nicht gefunden');
      }
      return contact;
    },
  },
  Mutation: {
    createContact: (_, { input }) => {
      const { firstName, lastName, email } = input;
      validateEmail(email);

      // Prüfen ob Email bereits existiert
      if (contacts.some(c => c.email === email)) {
        throw new UserInputError('Diese Email-Adresse wird bereits verwendet');
      }

      const newContact = {
        id: (contacts.length + 1).toString(),
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: null
      };
      contacts.push(newContact);
      return newContact;
    },

    updateContact: (_, { id, input }) => {
      const index = contacts.findIndex(c => c.id === id);
      if (index === -1) {
        throw new UserInputError('Kontakt nicht gefunden');
      }

      if (input.email) {
        validateEmail(input.email);
        // Prüfen ob neue Email bereits existiert (außer bei gleichem Kontakt)
        if (contacts.some(c => c.email === input.email && c.id !== id)) {
          throw new UserInputError('Diese Email-Adresse wird bereits verwendet');
        }
      }

      contacts[index] = {
        ...contacts[index],
        ...input,
        updatedAt: new Date().toISOString()
      };

      return contacts[index];
    },

    deleteContact: (_, { id }) => {
      const index = contacts.findIndex(c => c.id === id);
      if (index === -1) {
        throw new UserInputError('Kontakt nicht gefunden');
      }
      contacts.splice(index, 1);
      return true;
    },
  },
};

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  formatError: (err) => {
    // Logging für Produktionsumgebung
    console.error(err);
    return err;
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 GraphQL Server läuft unter ${url}`);
});

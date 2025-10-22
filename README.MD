# Librerie da installare come prima cosa
Va beh, a parte installare node.js bisogna anche fare 

`npm install express mysql2 dotenv`
 
e

`npm install nodemon --save-dev`

Scrivo questa roba perché ho paura che la cartella node_modules sia troppo pesante per git

# Cosa mettere nelle cartelle
1. Config: Tutte le configurazioni globali    
2. Models: Ci vanno i file dove vanno scritte le query
3. Controllers: Come nell'MVC chiamo il model per i dati e li restituisco
4. Routes: importa le funzioni dal controller, e le usa per mappare gli address

## Cosa metterci dentro ai file
Le cartelle appena esplicitate sono da considerare come quelle del modello MVC in PHP, nel senso: ci va un file per ogni singola tabella del database
- Nel file db.js ci vanno tutte operazioni per connettersi al database
- Diciamo che il file app.js è il cuore della API, nonché la roba che connette tutti i routes. Quindi qui dentro vanno esplicitati tutti i routes che sono nella cartella routes
- Nel file server.js ci sono scritte le cose essenziali per far partire il server.
- In x_routes ci vanno tutte le funzioni della API per la tabella X, si prendono le funzioni dal controller e gli si dice con che verbo le deve fare.
- In x_controller si chiama la funzione e si restituisce tramite json il risultato, o un errore.
- In x_model ci va proprio la funzione che fa operazioni sul DB

Credo che questo sia tutto. Comunque dovrei riempire tuttecose di mega commenti, quindi non dovrebbe essere troppo difficile capire tra mille anni.

### File completati
- [x] db.js
- [] app.js
- [x] server.js
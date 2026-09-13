# Librerie da installare come prima cosa
Va beh, a parte installare node.js bisogna anche fare 

`npm install express mysql2 dotenv`
`npm install nodemon --save-dev`
`npm i bcrypt`
`npm install jsonwebtoken` 

Scrivo questa roba perché ho paura che la cartella node_modules sia troppo pesante per git

# Per farlo partire da console
Almeno nella fase di sviluppo, non so ancora come farlo partire quando sarà sul serverozzo

`npm run dev`

# Creazione ambiente di sviluppo
Praticamente per poterci lavorare sopra, siccome XAMPP è una merda astronomica si usa Docker. Si fa tutto il procedimento per mettere il database su Docker e poi esso creerà il database in locale.
Per accedervi da vsCode (cosa altamente consigliata, in quanto è la cosa più comoda della terra) conviene usare lo user _dev_ e la password _devpass_

# Cosa mettere nelle cartelle
1. Config: Tutte le configurazioni globali    
2. Models: Ci vanno i file dove vanno scritte le query
3. Controllers: Come nell'MVC chiamo il model per i dati e li restituisco
4. Routes: importa le funzioni dal controller, e le usa per mappare gli address

# Log
Per quanto i trigger possano funzionare a tenere un log sono particolarmente inutili in questo contesto: l'ideale sarebbe una totale compartimentazione delle componenti. Il database fa i dati e l'API fa il resto. Serve fare un middleware o una funzione in Nodejs che scriva ad ogni operazione nel file log.
Quindi i trigger volano nel cestino e ora tocca creare una funzione wrapper per le operazioni sul DB che faccia in automatico anche il log. L'ho fatta fare a Gemini.
C'è un log separato per ogni giornata, tenere in considerazione (per quando il progetto sarà vicino alla fine) che un grande uso di questa API potrebbe benissimo riempire la memoria del PC se non vengono eliminati i log vecchi. Magari potrebbe essere una buona idea creare un sottoprogrammino avviabile da remoto che crea un report di tutti i log, con delle statistiche, per poi eliminarli definitivamente e liberare lo spazio. Avrebbe senso anche se venisse avviato automaticamente ogni mese o qualcosa del genere.

## Cosa metterci dentro ai file
Le cartelle appena esplicitate sono da considerare come quelle del modello MVC in PHP, nel senso: ci va un file per ogni singola tabella del database
- Nel file db.js ci vanno tutte operazioni per connettersi al database
- Diciamo che il file app.js è il cuore della API, nonché la roba che connette tutti i routes. Quindi qui dentro vanno esplicitati tutti i routes che sono nella cartella routes
- Nel file server.js ci sono scritte le cose essenziali per far partire il server.
- In x_routes ci vanno tutte le funzioni della API per la tabella X, si prendono le funzioni dal controller e gli si dice con che verbo le deve fare.
- In x_controller si chiama la funzione e si restituisce tramite json il risultato, o un errore.
- In x_model ci va proprio la funzione che fa operazioni sul DB

Credo che questo sia tutto. Comunque dovrei riempire tuttecose di mega commenti, quindi non dovrebbe essere troppo difficile capire tra mille anni.

### Cose da fare

#### Persona (Gestione Utenti ed Autenticazione)
- [x] Creare utente (Registrazione)
- [x] Login utente
- [x] Get utente (Profilo corrente)
- [x] Modifica utente
- [x] Eliminare utente

#### Casa (Gestione Nucleo Familiare)
- [x] Creare casa (Assegna automaticamente il ruolo 'owner')
- [x] Get casa (Dettagli e lista membri)
- [x] Modificare casa (Riservato a 'owner' e 'admin')
- [x] Eliminare casa (Riservato a 'owner')
- [x] Entrare in casa tramite codice invito
- [x] Gestione membri (Rimuovere un membro o uscire volontariamente dalla casa)

#### Catalogo Prodotti e Tipologie (Tabelle di Supporto)
- [x] Get tipologie dispensa (Sola lettura)
- [x] Get tipologie oggetti (Sola lettura)
- [x] Get marche (Sola lettura)
- [x] Ricerca prodotti nel catalogo (Restituisce i prodotti globali di sistema e i prodotti custom della specifica casa)
- [x] Creare nuovo prodotto custom (Associato alla casa dell'utente)

#### Dispensa (Gestione Contenitori)
- [x] Creare dispensa
- [x] Get dispense della casa
- [x] Modificare nome dispensa
- [ ] Eliminare dispensa

#### Oggetti Dispensa (Gestione Inventario)
- [ ] Aggiungere oggetto in dispensa (Inserimento manuale)
- [ ] Get oggetti in dispensa (Con filtro per dispensa, per stato o raggruppamento per prodotto)
- [ ] Modificare dettagli oggetto (Scadenza, stato_consumo)
- [ ] Consumare o buttare oggetto (Elimina da disp_oggetti e crea record in storico_consumi)

#### Oggetti Spesa (Gestione Acquisti)
- [ ] Aggiungere prodotto alla lista della spesa
- [ ] Get lista della spesa della casa
- [ ] Aggiornare stato della spesa (Es. da 'da_comprare' a 'nel_carrello')
- [ ] Rimuovere elemento dalla lista (Senza completare l'acquisto)
- [ ] Completare l'acquisto (Rimuove da spesa_ogg, richiede dettagli scadenza/capacità e inserisce in disp_oggetti)

#### Storico Consumi (Monitoraggio)
- [ ] Get storico (Elenco oggetti consumati/buttati per statistiche o reinserimento rapido nella spesa)

### Database
Il database utilizzato è quello che sta nell'altro progetto di git, eventualmente lo metterò in sta cartella, ma ora non ho proprio voglia :p 

Ogni volta che viene modificato il database bisogna, dentro alla cartella giusta, fare questi due comandi:
`docker-compose down -v`
`docker-compose up`

# Trigger
Ho avuto problemi con i trigger per i log, ho paura che siano da rifare completamente da capo, capita. Magari eviterei di farli implementare completamente da chatgpt, specialmente se non so come funzionino.
Per ora la scelta migliore sembra proprio di toglierli del tutto
### Cose che potrebbero tornare di molto utili
Credo che per testare la API insomnia sia broken e poi potrebbe tornare anche utile usare Swagger per la documentazione (comunque mi sembra che anche lui ti faccia testare la roba)

==ASSOLUTAMENTE== collegare gli errori della API con [http.cat](https://http.cat)

---

# Problemi noti
- Per il login bisogna fare qualcosa di più safe, dato che usare soltanto l'ID non è la scelta migliore. Creare un token per autorizzare tutte le operazioni.
- Secondo me dovrei fare dei return, dalle funzioni model, più significativi
- Gestire meglio gli errori, non è possibile che ogni errore fin'ora sia un internal server error.
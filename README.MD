# Librerie da installare come prima cosa
Va beh, a parte installare node.js bisogna anche fare 

`npm install express mysql2 dotenv`
`npm install nodemon --save-dev`
`npm i bcrypt`

Scrivo questa roba perché ho paura che la cartella node_modules sia troppo pesante per git

# Per farlo partire da console
Almeno nella fase di sviluppo, non so ancora come farlo partire quando sarà sul serverozzo

`npm run dev`

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

### Cose da fare
- [x] Creare utente
- [x] Login utente
- [ ] Modifica utente
- [ ] Eliminare utente

- [ ] Creare casa
- [ ] Modificare casa
- [ ] Eliminare casa
- [ ] Aggiungere persone alla casa

- [ ] Aggiungere oggetti spesa alla casa
- [ ] Modificare oggetti spesa dalla lista della casa
- [ ] Eliminare oggetti spesa dalla lista della casa
- [ ] Mettere gli oggetti dalla lista della spesa alla dispensa

- [ ] Creare dispensa
- [ ] Modificare dispensa
- [ ] Eliminare dispensa

- [ ] Creare tipo dispensa
- [ ] Modificare tipo dispensa
- [ ] Eliminare tipo dispensa
 
- [ ] Creare oggetti dispensa
- [ ] Modificare (e/o aggiornare) oggetti dispensa
- [ ] Eliminare oggetti dispensa
- [ ] Aggiungere informazioni a quelli ottenuti dalla lista della spesa
- [ ] Fare in modo che gli oggetti che si aggiungano, se dello stesso tipo (all'incirca, nel senso che alcune informazioni in certi casi possono anche andare nascoste) siano cumulabili.

- [ ] Creare tipo oggetti
- [ ] Modificare tipo oggetti
- [ ] Eliminare tipo oggetti

### Database
Il database utilizzato è quello che sta nell'altro progetto di git, eventualmente lo metterò in sta cartella, ma ora non ho proprio voglia :p 

# Trigger
Ho avuto problemi con i trigger per i log, ho paura che siano da rifare completamente da capo, capita. Magari eviterei di farli implementare completamente da chatgpt, specialmente se non so come funzionino.
Per ora la scelta migliore sembra proprio di toglierli del tutto
### Cose che potrebbero tornare di molto utili
Credo che per testare la API insomnia sia broken e poi potrebbe tornare anche utile usare Swagger per la documentazione (comunque mi sembra che anche lui ti faccia testare la roba)

---

# Problemi noti
- Per il login bisogna fare qualcosa di più safe, dato che usare soltanto l'ID non è la scelta migliore. Creare un token per autorizzare tutte le operazioni.
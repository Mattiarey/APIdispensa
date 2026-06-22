# Base per la creazione del database
Si vuole creare una base di dati `home_stuff` per la gestione degli oggetti nelle varie dispense.

Tutte le operazioni in questo DB devono venire eseguite da un utente, chiamato `persona`. Una persona ha un id, un nome, un cognome, una mail e una password. Da notare che solo la mail è unique, siccome non voglio mantenere tutte le info possibili sugli utenti, ne voglio il meno possibile.

Possono esserci molti utenti in una `casa`, quindi la relazione è stata scomposta in 
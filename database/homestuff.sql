CREATE DATABASE IF NOT EXISTS home_stuff;

USE home_stuff;

CREATE TABLE casa (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    codice_invito CHAR(8) NOT NULL, 
    
    UNIQUE INDEX idx_codice (codice_invito)
);
CREATE TABLE persona(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    cognome VARCHAR(30),
    mail VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
CREATE TABLE membri_casa (
    utente_id INT UNSIGNED NOT NULL,
    casa_id INT UNSIGNED NOT NULL,
    ruolo ENUM('owner', 'admin', 'member') DEFAULT 'member',
    unito_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (utente_id, casa_id), -- Impedisce doppioni
    FOREIGN KEY (utente_id) REFERENCES persona(id) ON DELETE CASCADE,
    FOREIGN KEY (casa_id) REFERENCES casa(id) ON DELETE CASCADE
);

CREATE TABLE ogg_tipo(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE disp_tipo(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE marca(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);


-- questa è la tabella principale che contiene i prodotti
-- tutte le altre di questo tipo si appoggiano a questa
CREATE TABLE prodotto_catalogo(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,

    fk_marca INT UNSIGNED NULL, 
    fk_ogg_tipo INT UNSIGNED NULL,

    -- Se NULL è un prodotto "Globale" (di sistema). Se valorizzato, è un prodotto "Custom" della casa.
    fk_casa INT UNSIGNED NULL,

    FOREIGN KEY (fk_marca) REFERENCES marca(id) ON DELETE SET NULL,
    FOREIGN KEY (fk_ogg_tipo) REFERENCES ogg_tipo(id) ON DELETE RESTRICT,
    FOREIGN KEY (fk_casa) REFERENCES casa(id) ON DELETE CASCADE
);

CREATE TABLE spesa_ogg (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fk_casa INT UNSIGNED NOT NULL,
    fk_prodotto INT UNSIGNED NOT NULL, 
    
    quantita_richiesta INT UNSIGNED DEFAULT 1, 
    status ENUM('da_comprare', 'nel_carrello', 'comprato') DEFAULT 'da_comprare',
    fk_aggiunto_da INT UNSIGNED,
    data_aggiunta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fk_casa) REFERENCES casa(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_prodotto) REFERENCES prodotto_catalogo(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_aggiunto_da) REFERENCES persona(id) ON DELETE SET NULL
);

CREATE TABLE dispensa (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fk_casa INT UNSIGNED NOT NULL,
    fk_disp_tipo INT UNSIGNED NOT NULL,
    nome VARCHAR(30) NOT NULL,
    
    FOREIGN KEY (fk_casa) REFERENCES casa(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_disp_tipo) REFERENCES disp_tipo(id) ON DELETE RESTRICT
);

CREATE TABLE disp_oggetti (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fk_prodotto INT UNSIGNED NOT NULL,
    fk_disp INT UNSIGNED NOT NULL,
    
    scadenza DATE,
    capacita_confezione DECIMAL(10,2), 
    unita_misura ENUM('g', 'kg', 'ml', 'l', 'pz') DEFAULT 'g',
    
    -- Stato visivo per l'utente (manca 'finito' perché viene cancellato)
    stato_consumo ENUM('nuovo', 'aperto', 'in_esaurimento') DEFAULT 'nuovo',
    data_inserimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fk_prodotto) REFERENCES prodotto_catalogo(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_disp) REFERENCES dispensa(id) ON DELETE CASCADE
);

CREATE TABLE storico_consumi (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fk_prodotto INT UNSIGNED NOT NULL,
    fk_casa INT UNSIGNED NOT NULL,
    fk_persona INT UNSIGNED, -- Chi l'ha finito/buttato
    
    scadenza_originale DATE,
    capacita_originale DECIMAL(10,2),
    unita_misura_originale ENUM('g', 'kg', 'ml', 'l', 'pz'),
    data_inserimento_originale TIMESTAMP,
    
    data_consumo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo_consumo ENUM('mangiato', 'buttato_scaduto', 'buttato_altro') DEFAULT 'mangiato',
    
    FOREIGN KEY (fk_prodotto) REFERENCES prodotto_catalogo(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_casa) REFERENCES casa(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_persona) REFERENCES persona(id) ON DELETE SET NULL
);
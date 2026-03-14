CREATE DATABASE IF NOT EXISTS home_stuff;

USE home_stuff;

CREATE TABLE casa (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    codice_invito CHAR(8) NOT NULL, -- Lunghezza fissa per efficienza
    
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

CREATE TABLE spesa_ogg(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    marca VARCHAR(40),
    quantita INT UNSIGNED DEFAULT 1,
    peso DECIMAL(10,2),
    data_aggiunta DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_casa INT UNSIGNED NOT NULL,

    CONSTRAINT fk_spesa_casa FOREIGN KEY (fk_casa)
        REFERENCES casa(id)
        ON DELETE CASCADE
);
CREATE TABLE disp_tipo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);
CREATE TABLE dispensa(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_casa INT UNSIGNED NOT NULL,
    fk_disp_tipo INT NOT NULL,
    nome VARCHAR(30) NOT NULL,
    CONSTRAINT fk_dispensa_casa FOREIGN KEY (fk_casa)
        REFERENCES casa(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_disp_tipo_casa FOREIGN KEY (fk_disp_tipo)
        REFERENCES disp_tipo(id)
        ON DELETE CASCADE  
);
CREATE TABLE ogg_tipo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);
CREATE TABLE disp_oggetti(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_ogg_tipo INT NOT NULL,
    fk_disp INT NOT NULL,
    nome VARCHAR(60) NOT NULL,
    marca VARCHAR(30),
    scadenza DATE,
    data_acquisto DATETIME DEFAULT CURRENT_TIMESTAMP,
    peso_max DECIMAL(10,2),
    percentuale INT CHECK (percentuale BETWEEN 1 AND 100),
    peso_attuale DECIMAL(10,2),
    numero INT UNSIGNED DEFAULT 1,

    CONSTRAINT fk_ogg_tipo_ogg FOREIGN KEY (fk_ogg_tipo)
        REFERENCES ogg_tipo(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_disp_disp FOREIGN KEY (fk_disp)
        REFERENCES dispensa(id)
        ON DELETE CASCADE

);
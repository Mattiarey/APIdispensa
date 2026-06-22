create database if not exists home_stuff;
use home_stuff;
create table casa (
    id INT unsigned auto_increment primary key,
    nome VARCHAR(100) not null,
    slug VARCHAR(120) not null,
    codice_invito CHAR(8) not null,
    unique index idx_codice (codice_invito)
);
create table persona(
    id INT unsigned auto_increment primary key,
    nome VARCHAR(30) not null,
    cognome VARCHAR(30),
    mail VARCHAR(255) not null unique,
    password_hash VARCHAR(255) not null
);
create table membri_casa (
    utente_id INT unsigned not null,
    casa_id INT unsigned not null,
    ruolo ENUM('owner', 'admin', 'member') default 'member',
    unito_il TIMESTAMP default current_timestamp,
    primary key (utente_id, casa_id),
    -- Impedisce doppioni
    foreign key (utente_id) references persona(id) on delete cascade,
    foreign key (casa_id) references casa(id) on delete cascade
);
create table ogg_tipo(
    id INT unsigned auto_increment primary key,
    nome VARCHAR(100) not null
);
create table disp_tipo(
    id INT unsigned auto_increment primary key,
    nome VARCHAR(100) not null
);
create table marca(
    id INT unsigned auto_increment primary key,
    nome VARCHAR(50) not null unique
);
-- questa è la tabella principale che contiene i prodotti
-- tutte le altre di questo tipo si appoggiano a questa
create table prodotto_catalogo(
    id INT unsigned auto_increment primary key,
    nome VARCHAR(100) not null,
    fk_marca INT unsigned null,
    fk_ogg_tipo INT unsigned null,
    -- Se NULL è un prodotto "Globale" (di sistema). Se valorizzato, è un prodotto "Custom" della casa.
    fk_casa INT unsigned null,
    foreign key (fk_marca) references marca(id) on delete
    set null,
        foreign key (fk_ogg_tipo) references ogg_tipo(id) on delete restrict,
        foreign key (fk_casa) references casa(id) on delete cascade
);
create table spesa_ogg (
    id INT unsigned auto_increment primary key,
    fk_casa INT unsigned not null,
    fk_prodotto INT unsigned not null,
    quantita_richiesta INT unsigned default 1,
    status ENUM('da_comprare', 'nel_carrello', 'comprato') default 'da_comprare',
    fk_aggiunto_da INT unsigned,
    data_aggiunta TIMESTAMP default current_timestamp,
    foreign key (fk_casa) references casa(id) on delete cascade,
    foreign key (fk_prodotto) references prodotto_catalogo(id) on delete cascade,
    foreign key (fk_aggiunto_da) references persona(id) on delete
    set null
);
create table dispensa (
    id INT unsigned auto_increment primary key,
    fk_casa INT unsigned not null,
    fk_disp_tipo INT unsigned not null,
    nome VARCHAR(30) not null,
    foreign key (fk_casa) references casa(id) on delete cascade,
    foreign key (fk_disp_tipo) references disp_tipo(id) on delete restrict
);
create table disp_oggetti (
    id INT unsigned auto_increment primary key,
    fk_prodotto INT unsigned not null,
    fk_disp INT unsigned not null,
    scadenza DATE,
    capacita_confezione DECIMAL(10, 2),
    unita_misura ENUM('g', 'kg', 'ml', 'l', 'pz') default 'g',
    -- Stato visivo per l'utente (manca 'finito' perché viene cancellato)
    stato_consumo ENUM('nuovo', 'aperto', 'in_esaurimento') default 'nuovo',
    data_inserimento TIMESTAMP default current_timestamp,
    foreign key (fk_prodotto) references prodotto_catalogo(id) on delete cascade,
    foreign key (fk_disp) references dispensa(id) on delete cascade
);
create table storico_consumi (
    id INT unsigned auto_increment primary key,
    fk_prodotto INT unsigned not null,
    fk_casa INT unsigned not null,
    fk_persona INT unsigned,
    -- Chi l'ha finito/buttato
    scadenza_originale DATE,
    capacita_originale DECIMAL(10, 2),
    unita_misura_originale ENUM('g', 'kg', 'ml', 'l', 'pz'),
    data_inserimento_originale TIMESTAMP,
    data_consumo TIMESTAMP default current_timestamp,
    motivo_consumo ENUM('mangiato', 'buttato_scaduto', 'buttato_altro') default 'mangiato',
    foreign key (fk_prodotto) references prodotto_catalogo(id) on delete
    set null,
        foreign key (fk_casa) references casa(id) on delete
    set null,
        foreign key (fk_persona) references persona(id) on delete
    set null
);
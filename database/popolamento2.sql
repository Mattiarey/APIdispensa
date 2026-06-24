-- 1. ASSOCIAZIONE MEMBRI CASA
-- Usiamo gli ID reali degli utenti (10, 11, 12) e delle case (5, 6)
-- Aggiungo IGNORE così se li avevi già associati non va in errore
insert ignore into membri_casa (utente_id, casa_id, ruolo)
values (10, 5, 'owner'),
    (11, 5, 'admin'),
    (11, 6, 'owner'),
    (12, 6, 'member');
-- 2. POPOLAMENTO PRODOTTI CATOLOGO (Usando variabili sicure per gli ID)
-- Prodotto Globale 1: Spaghetti (Marca: Barilla ID 1, Tipo: Pasta ID 25)
insert into prodotto_catalogo (nome, fk_marca, fk_ogg_tipo, fk_casa)
values ('Spaghetti N.5', 1, 25, null);
set @prod_spaghetti = last_insert_id();
-- Prodotto Globale 2: Passata (Marca: Mutti ID 3, Tipo: Sughi ID 30)
insert into prodotto_catalogo (nome, fk_marca, fk_ogg_tipo, fk_casa)
values ('Passata di Pomodoro', 3, 30, null);
set @prod_passata = last_insert_id();
-- Prodotto Globale 3: Biscotti (Marca: Mulino Bianco ID 2, Tipo: Dolci ID 31)
insert into prodotto_catalogo (nome, fk_marca, fk_ogg_tipo, fk_casa)
values ('Biscotti Pan di Stelle', 2, 31, null);
set @prod_biscotti = last_insert_id();
-- Prodotto Globale 4: Detersivo (Marca: Dash ID 11, Tipo: Detersivi ID 36)
insert into prodotto_catalogo (nome, fk_marca, fk_ogg_tipo, fk_casa)
values ('Detersivo Lavatrice', 11, 36, null);
set @prod_detersivo = last_insert_id();
-- Prodotto Custom Casa 5: Torta (Nessuna marca, Tipo: Dolci ID 31)
insert into prodotto_catalogo (nome, fk_marca, fk_ogg_tipo, fk_casa)
values ('Torta di Mele Fatta in Casa', null, 31, 5);
set @prod_torta = last_insert_id();
-- Prodotto Custom Casa 6: Birra (Nessuna marca, Tipo: Alcolici ID 33)
insert into prodotto_catalogo (nome, fk_marca, fk_ogg_tipo, fk_casa)
values ('Birra Artigianale Locale', null, 33, 6);
set @prod_birra = last_insert_id();
-- 3. POPOLAMENTO SPESA
-- Inseriamo gli elementi usando le variabili generate sopra
insert into spesa_ogg (
        fk_casa,
        fk_prodotto,
        quantita_richiesta,
        status,
        fk_aggiunto_da
    )
values (5, @prod_spaghetti, 2, 'da_comprare', 10),
    (5, @prod_detersivo, 1, 'nel_carrello', 11),
    (6, @prod_birra, 6, 'da_comprare', 12),
    (6, @prod_biscotti, 1, 'da_comprare', 11);
-- 4. CREAZIONE DISPENSE (Contenitori fisici)
-- Dispense Casa 5 (Frigorifero ID 21, Dispensa ID 23)
insert into dispensa (fk_casa, fk_disp_tipo, nome)
values (5, 21, 'Frigorifero Cucina');
set @disp_frigo_casa5 = last_insert_id();
insert into dispensa (fk_casa, fk_disp_tipo, nome)
values (5, 23, 'Mobile Colonna');
set @disp_mobile_casa5 = last_insert_id();
-- Dispense Casa 6 (Dispensa ID 23, Sottolavello ID 26)
insert into dispensa (fk_casa, fk_disp_tipo, nome)
values (6, 23, 'Dispensa Condivisa');
set @disp_condivisa_casa6 = last_insert_id();
insert into dispensa (fk_casa, fk_disp_tipo, nome)
values (6, 26, 'Sottolavello Bagno');
set @disp_bagno_casa6 = last_insert_id();
-- 5. POPOLAMENTO INVENTARIO (Oggetti nelle dispense)
insert into disp_oggetti (
        fk_prodotto,
        fk_disp,
        scadenza,
        capacita_confezione,
        unita_misura,
        stato_consumo
    )
values (
        @prod_passata,
        @disp_frigo_casa5,
        '2026-12-31',
        700.00,
        'g',
        'aperto'
    ),
    (
        @prod_biscotti,
        @disp_mobile_casa5,
        '2027-05-15',
        350.00,
        'g',
        'nuovo'
    ),
    (
        @prod_torta,
        @disp_frigo_casa5,
        '2026-06-26',
        1.00,
        'pz',
        'in_esaurimento'
    ),
    (
        @prod_detersivo,
        @disp_bagno_casa6,
        '2028-01-01',
        2.50,
        'l',
        'nuovo'
    );
-- 6. POPOLAMENTO STORICO CONSUMI
insert into storico_consumi (
        fk_prodotto,
        fk_casa,
        fk_persona,
        scadenza_originale,
        capacita_originale,
        unita_misura_originale,
        data_inserimento_originale,
        motivo_consumo
    )
values (
        @prod_spaghetti,
        5,
        10,
        '2025-10-10',
        500.00,
        'g',
        '2025-09-01 10:00:00',
        'mangiato'
    ),
    (
        @prod_passata,
        5,
        11,
        '2026-01-01',
        700.00,
        'g',
        '2025-11-15 15:30:00',
        'buttato_scaduto'
    ),
    (
        @prod_birra,
        6,
        12,
        '2026-05-20',
        330.00,
        'ml',
        '2026-05-10 18:00:00',
        'mangiato'
    );
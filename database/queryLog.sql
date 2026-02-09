CREATE TABLE log_operazioni (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    utente_id INT NOT NULL,
    tabella_nome VARCHAR(64) NOT NULL,
    operazione ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    record_id INT NOT NULL,
    dati_precedenti JSON NULL,
    dati_nuovi JSON NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- trigger per la casa
CREATE TRIGGER log_casa_insert
AFTER INSERT ON casa
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'casa', 'INSERT', NEW.id,
        JSON_OBJECT('nome', NEW.nome));

CREATE TRIGGER log_casa_update
AFTER UPDATE ON casa
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'casa', 'UPDATE', NEW.id,
        JSON_OBJECT('nome', OLD.nome),
        JSON_OBJECT('nome', NEW.nome));

CREATE TRIGGER log_casa_delete
AFTER DELETE ON casa
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'casa', 'DELETE', OLD.id,
        JSON_OBJECT('nome', OLD.nome));


-- trigger per la persona
/*CREATE TRIGGER log_persona_insert
AFTER INSERT ON persona
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'persona', 'INSERT', NEW.id,
        JSON_OBJECT('nome', NEW.nome, 'cognome', NEW.cognome, 'mail', NEW.mail));
*/
CREATE TRIGGER log_persona_update
AFTER UPDATE ON persona
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'persona', 'UPDATE', NEW.id,
        JSON_OBJECT('nome', OLD.nome, 'cognome', OLD.cognome, 'mail', OLD.mail),
        JSON_OBJECT('nome', NEW.nome, 'cognome', NEW.cognome, 'mail', NEW.mail));

CREATE TRIGGER log_persona_delete
AFTER DELETE ON persona
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'persona', 'DELETE', OLD.id,
        JSON_OBJECT('nome', OLD.nome, 'cognome', OLD.cognome, 'mail', OLD.mail));


-- trigger per la tab_abita
CREATE TRIGGER log_tab_abita_insert
AFTER INSERT ON tab_abita
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'tab_abita', 'INSERT', NEW.id,
        JSON_OBJECT('fk_persona', NEW.fk_persona, 'fk_casa', NEW.fk_casa));

CREATE TRIGGER log_tab_abita_update
AFTER UPDATE ON tab_abita
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'tab_abita', 'UPDATE', NEW.id,
        JSON_OBJECT('fk_persona', OLD.fk_persona, 'fk_casa', OLD.fk_casa),
        JSON_OBJECT('fk_persona', NEW.fk_persona, 'fk_casa', NEW.fk_casa));

CREATE TRIGGER log_tab_abita_delete
AFTER DELETE ON tab_abita
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'tab_abita', 'DELETE', OLD.id,
        JSON_OBJECT('fk_persona', OLD.fk_persona, 'fk_casa', OLD.fk_casa));


-- trigger per spesa_ogg
CREATE TRIGGER log_spesa_ogg_insert
AFTER INSERT ON spesa_ogg
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'spesa_ogg', 'INSERT', NEW.id,
        JSON_OBJECT('nome', NEW.nome, 'marca', NEW.marca, 'quantita', NEW.quantita, 'peso', NEW.peso, 'fk_casa', NEW.fk_casa));

CREATE TRIGGER log_spesa_ogg_update
AFTER UPDATE ON spesa_ogg
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'spesa_ogg', 'UPDATE', NEW.id,
        JSON_OBJECT('nome', OLD.nome, 'marca', OLD.marca, 'quantita', OLD.quantita, 'peso', OLD.peso, 'fk_casa', OLD.fk_casa),
        JSON_OBJECT('nome', NEW.nome, 'marca', NEW.marca, 'quantita', NEW.quantita, 'peso', NEW.peso, 'fk_casa', NEW.fk_casa));

CREATE TRIGGER log_spesa_ogg_delete
AFTER DELETE ON spesa_ogg
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'spesa_ogg', 'DELETE', OLD.id,
        JSON_OBJECT('nome', OLD.nome, 'marca', OLD.marca, 'quantita', OLD.quantita, 'peso', OLD.peso, 'fk_casa', OLD.fk_casa));


-- trigger per disp_tipo
CREATE TRIGGER log_disp_tipo_insert
AFTER INSERT ON disp_tipo
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'disp_tipo', 'INSERT', NEW.id,
        JSON_OBJECT('nome', NEW.nome));

CREATE TRIGGER log_disp_tipo_update
AFTER UPDATE ON disp_tipo
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'disp_tipo', 'UPDATE', NEW.id,
        JSON_OBJECT('nome', OLD.nome),
        JSON_OBJECT('nome', NEW.nome));

CREATE TRIGGER log_disp_tipo_delete
AFTER DELETE ON disp_tipo
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'disp_tipo', 'DELETE', OLD.id,
        JSON_OBJECT('nome', OLD.nome));


-- trigger per dispensa
CREATE TRIGGER log_dispensa_insert
AFTER INSERT ON dispensa
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'dispensa', 'INSERT', NEW.id,
        JSON_OBJECT('fk_casa', NEW.fk_casa, 'fk_disp_tipo', NEW.fk_disp_tipo, 'nome', NEW.nome));

CREATE TRIGGER log_dispensa_update
AFTER UPDATE ON dispensa
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'dispensa', 'UPDATE', NEW.id,
        JSON_OBJECT('fk_casa', OLD.fk_casa, 'fk_disp_tipo', OLD.fk_disp_tipo, 'nome', OLD.nome),
        JSON_OBJECT('fk_casa', NEW.fk_casa, 'fk_disp_tipo', NEW.fk_disp_tipo, 'nome', NEW.nome));

CREATE TRIGGER log_dispensa_delete
AFTER DELETE ON dispensa
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'dispensa', 'DELETE', OLD.id,
        JSON_OBJECT('fk_casa', OLD.fk_casa, 'fk_disp_tipo', OLD.fk_disp_tipo, 'nome', OLD.nome));


-- trigger per ogg_tipo
CREATE TRIGGER log_ogg_tipo_insert
AFTER INSERT ON ogg_tipo
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'ogg_tipo', 'INSERT', NEW.id,
        JSON_OBJECT('nome', NEW.nome));

CREATE TRIGGER log_ogg_tipo_update
AFTER UPDATE ON ogg_tipo
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'ogg_tipo', 'UPDATE', NEW.id,
        JSON_OBJECT('nome', OLD.nome),
        JSON_OBJECT('nome', NEW.nome));

CREATE TRIGGER log_ogg_tipo_delete
AFTER DELETE ON ogg_tipo
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'ogg_tipo', 'DELETE', OLD.id,
        JSON_OBJECT('nome', OLD.nome));


-- trigger per disp_oggetti 
CREATE TRIGGER log_disp_oggetti_insert
AFTER INSERT ON disp_oggetti
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_nuovi)
VALUES (@current_user_id, 'disp_oggetti', 'INSERT', NEW.id,
        JSON_OBJECT('fk_ogg_tipo', NEW.fk_ogg_tipo, 'nome', NEW.nome, 'marca', NEW.marca, 'peso_max', NEW.peso_max, 'percentuale', NEW.percentuale, 'peso_attuale', NEW.peso_attuale, 'numero', NEW.numero));

CREATE TRIGGER log_disp_oggetti_update
AFTER UPDATE ON disp_oggetti
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti, dati_nuovi)
VALUES (@current_user_id, 'disp_oggetti', 'UPDATE', NEW.id,
        JSON_OBJECT('fk_ogg_tipo', OLD.fk_ogg_tipo, 'nome', OLD.nome, 'marca', OLD.marca, 'peso_max', OLD.peso_max, 'percentuale', OLD.percentuale, 'peso_attuale', OLD.peso_attuale, 'numero', OLD.numero),
        JSON_OBJECT('fk_ogg_tipo', NEW.fk_ogg_tipo, 'nome', NEW.nome, 'marca', NEW.marca, 'peso_max', NEW.peso_max, 'percentuale', NEW.percentuale, 'peso_attuale', NEW.peso_attuale, 'numero', NEW.numero));

CREATE TRIGGER log_disp_oggetti_delete
AFTER DELETE ON disp_oggetti
FOR EACH ROW
INSERT INTO log_operazioni
(utente_id, tabella_nome, operazione, record_id, dati_precedenti)
VALUES (@current_user_id, 'disp_oggetti', 'DELETE', OLD.id,
        JSON_OBJECT('fk_ogg_tipo', OLD.fk_ogg_tipo, 'nome', OLD.nome, 'marca', OLD.marca, 'peso_max', OLD.peso_max, 'percentuale', OLD.percentuale, 'peso_attuale', OLD.peso_attuale, 'numero', OLD.numero));

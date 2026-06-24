// generato dal sistema quando parte il db
export class Marca {
    constructor(nome, id = null){
        this.id = id;
        this.nome = nome;
    }
};
// generato dal sistema quando parte il db
export class Oggetto_tipo{
    constructor(nome, id = null){
        this.id = id;
        this.nome = nome;
    }
};
// generato dal sistema quando parte il db e anche creato dagli utenti
export class Dispensa_tipo{
    constructor(nome, id = null){
        this.id = id;
        this.nome = nome;
    }
};
/**
 * Generato dal sistema quando parte il db e anche creato dagli utenti.
 * Inoltre se la foreign key di casa è null allora è un prodotto globale, altrimenti è custom della casa.
 * Gestisce sia l'inserimento con chiavi esterne, che la lettura con join
 */
export class Prodotto {
    constructor({ 
        id = null, 
        nome, 
        fk_marca = null, 
        fk_ogg_tipo = null, 
        fk_casa = null, 
        
        // Dati opzionali derivanti da query JOIN
        nome_marca = null,
        nome_tipo = null
    }) {
        // Attributi base della tabella prodotto_catalogo
        this.id = id;
        this.nome = nome;
        this.fk_marca = fk_marca;
        this.fk_ogg_tipo = fk_ogg_tipo;
        this.fk_casa = fk_casa;

        // Attributi estesi: popolati solo se la query SQL fornisce questi dati
        if (nome_marca !== null) {
            this.marca = { id: fk_marca, nome: nome_marca };
        }
        
        if (nome_tipo !== null) {
            this.tipo = { id: fk_ogg_tipo, nome: nome_tipo };
        }
    }
}

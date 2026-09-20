export default class DispOggetti {
    constructor({
        id = null,
        fk_prodotto = null,
        fk_disp,
        scadenza = null,
        capacita_confezione = null, 
        unita_misura = 'g', 
        stato_consumo = 'nuovo'
    }){
        this.id = id;
        this.fk_prodotto = fk_prodotto;
        this.fk_disp = fk_disp;
        this.scadenza = scadenza;
        
        // Gestione esplicita del formato DECIMAL(10,2)
        this.capacita_confezione = capacita_confezione !== null && capacita_confezione !== "" 
            ? parseFloat(capacita_confezione).toFixed(2) 
            : null;

        const unitaValide = ["g", "kg", "ml", "l", "pz"];
        this.unita_misura = unitaValide.includes(unita_misura) ? unita_misura : 'g';

        const statiValidi = ["nuovo", "aperto", "in_esaurimento"];
        this.stato_consumo = statiValidi.includes(stato_consumo) ? stato_consumo : 'nuovo';
    }
}
export default class Dispensa {
    constructor({
        id = null,
        nome,
        fk_casa = null,
        fk_disp_tipo = null,

        nome_casa = null,
        nome_tipo = null
    }){
        this.id = id;
        this.nome = nome;
        this.fk_casa = fk_casa;
        this.fk_disp_tipo = fk_disp_tipo;


        if(nome_casa !== null)
            this.nome_casa = {id: fk_casa, nome: nome_casa};
        if(nome_tipo !== null)
            this.nome_tipo = {id: fk_disp_tipo, nome: nome_tipo};
        
    }
}
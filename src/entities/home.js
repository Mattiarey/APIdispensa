export default class Casa {
    constructor(nome) {
        // id
        this.nome = nome;
        this.slug = Casa.generateSlug(nome);
        this.code = Casa.generateInviteCode(); // codice invito
    }
    static generateSlug(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }
    static generateInviteCode(length = 8) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }

        return result;
    }
}

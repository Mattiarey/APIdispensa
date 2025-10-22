import bcrypt from 'bcrypt';

/**
 * Equivalente in classe della tabella persona del database
 * Per creare un nuovo utente, usare il metodo statico create
 * Gli altri metodi statici non vanno bene, ma sono necessari 
 */
export default class Persona {
  constructor({ nome, cognome, email, passwordHash }) {
    this.nome = nome;
    this.cognome = cognome;
    this.email = email;
    this.password = passwordHash;
  }

  static async create({ nome, cognome, email, password }) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    let passwordHash = await bcrypt.hash(password, salt);
    return new Persona({ nome, cognome, email, passwordHash });
  }
  static createSafe({ nome, cognome, mail, password_hash }) {
    return new Persona({nome, cognome, email:mail, passwordHash:password_hash });
  }
  static createCredentials({ email, password }) {
    return new Persona({ nome:null, cognome:null, email, passwordHash:password });
  }

  async verifica_password(password) {
    return await bcrypt.compare(password, this.password);
  }
}



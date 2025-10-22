import bcrypt from 'bcrypt';


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


/*export class SafePersona {
  constructor({ id, nome, cognome, email, password_hash }) {
    this.id = id;
    this.nome = nome;
    this.cognome = cognome;
    this.mail = email;
    this.password_hash = password_hash;
  }
  async verifica_password(password) {
    console.log(this.password_hash, password);
    return await bcrypt.compare(password, this.password_hash);
  }
}
export class Credentials extends SafePersona {
  constructor({ email, password }) {
    super({ email, password });
    this.mail = email;
    this.password_hash = password;
  }
}*/

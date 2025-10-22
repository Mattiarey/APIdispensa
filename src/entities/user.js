import bcrypt from 'bcrypt';

export default class Persona {
  constructor({nome, cognome, email, password }) {
    const saltRounds = 10;

    this.nome = nome;
    this.cognome = cognome;
    this.email = email;
    this.password = bcrypt.hashSync(password, saltRounds);
  }

  verifica_password(password) {
    return bcrypt.compare(password, this.password);
  }
}
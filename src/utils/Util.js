class Util {
  isEmpty(texto) {
    return texto.trim() === '' ||  texto === undefined || texto === null;
  }
}

export default new Util();
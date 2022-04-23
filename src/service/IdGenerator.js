const IdGenerator = {
  generate(idType) {
    idType.lastId += 1
    return idType.lastId.toString().padStart(idType.length, '0')
  }
}

const IdType = {
  game: {length: 4, lastId: 0},
  player: {length: 6, lastId: 0}
}

export {IdType, IdGenerator}

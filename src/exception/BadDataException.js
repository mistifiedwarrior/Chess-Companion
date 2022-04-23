class BadDataException extends Error {
  error;
  
  constructor(error) {
    super(error.message)
    this.error = error
  }
}

export default BadDataException

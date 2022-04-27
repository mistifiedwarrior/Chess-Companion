const logOnSuccess = (message, searchableFields) => (returnValue) => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({message, searchableFields}))
  return returnValue
}

const logOnError = (errorCode, errorMessage, searchableFields) => (returnValue) => {
  // eslint-disable-next-line no-console
  console.error(JSON.stringify({errorCode, errorMessage, searchableFields}))
  throw returnValue
}

const logger = {
  info(values) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(values))
  },
  error(errorMessage) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({errorMessage}))
  }
}

export {logOnError, logOnSuccess, logger}

import {HTTP_CODES} from '../config/httpCodes.js'
import BadDataException from '../exception/BadDataException.js'

const getErrorResponse = (error) => ({statusCode: error.code, message: error.message})

const handleError = (res, error, errorDetails) => {
  
  if (error instanceof BadDataException) {
    res.status(HTTP_CODES.BAD_REQUEST).send(error)
    return
  }
  
  if (errorDetails) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(getErrorResponse(errorDetails))
  } else {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).end()
  }
}

export {handleError}

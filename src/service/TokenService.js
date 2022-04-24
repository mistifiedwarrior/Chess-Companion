import jwt from 'jsonwebtoken'

const TokenService = () => ({
  createToken(values) {
    return jwt.sign(values, 'secretKey')
  },
  parseToken(authorization) {
    return jwt.verify(authorization, 'secretKey')
  }
})

export default TokenService()

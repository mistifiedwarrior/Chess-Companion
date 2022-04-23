import jwt from 'jsonwebtoken'

const TokenService = () => ({
  createToken(values) {
    return jwt.sign(values, 'secretKey')
  }
})

export default TokenService()

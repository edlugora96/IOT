const { generateKeyPair, publicEncrypt, constants } = require("crypto")
const bcrypt = require("bcrypt")
const cryptoRandomString = require("crypto-random-string")
const generateKeys = async () => {
  return new Promise((resolve, reject) => {
    generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: cryptoRandomString({ length: 256 }),
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          return reject(err)
        }
        return resolve({ publicKey, privateKey })
      }
    )
  })
}

const hashPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return reject(err)
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          return reject(err)
        }
        return resolve(hash)
      })
    })
  })
}

const comparePasswords = async storePassword => async password => {
  return await bcrypt.compare(password, storePassword)
}

const encryptedData = (message, publicKey) =>
  publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(message)
  ).toString("base64")

module.exports = {
  encryptedData,
  generateKeys,
  hashPassword,
  comparePasswords,
}

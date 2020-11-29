const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const crypto = require('crypto')
const signer = crypto.createSign('sha256')
const hotelbed = require('../models/hotelbeds')
const fetch = require('node-fetch')
const pwd = `${process.env.REACT_APP_apikey}${process.env.REACT_APP_sec}${Math.round(new Date().getTime() / 1000)}`


const getSignature = () => {
const Sign= crypto.createHash('sha256').update(pwd).digest('hex')
  return Sign
}
const masterLinkLarge = 'https://photos.hotelbeds.com/giata/bigger/'
const formatLargePictures = (imageArr) => {
    const hotelsLarge = []
    imageArr.map((imageObject) => {
      const imageObjectPath = imageObject.path
      const newPath = `${masterLinkLarge}${imageObjectPath}`
      imageObject = { ...imageObject, path: newPath }
  
      hotelsLarge.push(imageObject)
    })
    return hotelsLarge
  }

  const formatData = (dataArr) => {
      return dataArr.map(obj =>({
          images:formatLargePictures(obj.images),
          name:obj.name
      }))
  }
const reszy= getSignature()
console.log(reszy)
console.log(process.env.REACT_APP_apikey,'Iam hit...')


router.get('/', async (req, res) => {
  console.log(process.env.REACT_APP_apikey,'Iam hit...')
    
 const signatureAPI= "9695d0a1a5ced3137d5a0120b728494581e58469690d3ebadac6c9df1e3a30ba"
 const options={
   method:'GET',
   headers:{
    'Api-Key': process.env.REACT_APP_apikey,
        'X-Signature':getSignature() ,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
   }
 }
console.log(options,"OPTIONS")
 
 const fetch_reponse= await fetch('https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels?fields=all&destinationCode=PMI&language=ENG&from=1&to=100',options)
  .then(response => response.json())
  .then( response => formatData(response.hotels))
  .then(response => {
    res.json(response)
    hotelbed.insertMany(response).then(r => console.log(r))
  })
  .catch(err=> console.log(err,'erree'))
  
 
})
module.exports = router
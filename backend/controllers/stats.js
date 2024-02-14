const express = require('express')
const router = express.Router()
const { getAsync } = require('../redis')

router.get('/', async (req, res) => {
  const added_blogs = await getAsync('added_blogs')
  res.send({
    added_blogs: added_blogs ? Number(added_blogs) : 0
  })
})

module.exports = router

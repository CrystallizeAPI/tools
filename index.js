require('dotenv').config()
require('esm')(module /*, options*/)

const importer = require('./main.js')

importer.main(['Toys'])

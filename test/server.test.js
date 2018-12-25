const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const app = require('../server');
const environment = 'testing';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('All routes', () => {

  beforeEach(done => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        return knex.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/bucket_list', () => {
    it('should return all items', done => {
      chai.request(server)
        .get('/api/v1/bucket_list')
        .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(3);
        res.body[0].should.have.property('title');
        res.body[0].title.should.equal('Skydiving');
        res.body[0].should.have.property('description');
        res.body[0].description.should.equal('Jump out of a plane');
        res.body[0].should.have.property('id');
        res.body[0].id.should.equal(1);
        done();
      });
    });
  
    it('should return a 404 for a route that does not exist', done => {
      chai.request(server)
        .get('/sad')
        .end((err, res) => {
          res.should.have.status(404)
          done();
        });
      });
    });

  describe('POST /api/v1/bucket_list', () => {
    it('should add an item', done => {
      chai.request(server)
        .post('/api/v1/bucket_list')
        .send({
          title: 'Hong Kong',
          description: 'Go to Hong Kong'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.id.should.equal(4);
          done();
        });
      });
      
      it('should not create a record with missing data', done => {
        chai.request(server)
        .post('/api/v1/projects')
        .send({ description: 'Super dooper!' })
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

  describe('DELETE /api/v1/bucket_list', () => {
    it('should delete an item by its ID', done => {
      chai.request(server)
        .delete('/api/v1/bucket_list/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.equal(1);
        });

      chai.request(server)
        .get('/api/v1/bucket_list')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.length.should.equal(2);
          done();
        });
    });

    it('should return an error if the ID does not exist', done => {
      chai.request(server)
        .delete('/api/v1/bucket_list/5')
        .end((err, res) => {
          res.should.have.status(422);
          res.error.text.should.equal('{"error":"422: No items found matching that ID."}');
          done();
        });
    });
  });
}); 
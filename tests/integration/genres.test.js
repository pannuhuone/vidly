const mongoose= require('mongoose');
const request = require('supertest');
const {Genre} =require('../../models/genre');
const {User} =require('../../models/user');

let server;

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    server.close(); 
    await Genre.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        {name: 'genre1'},
        {name: 'genre2'},
      ])

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    })
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' })
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    })

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    })

    it('should return 404 if id is valid but document with give id cannot be found', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    })


  });

  describe('POST /', () => {

    // Define the happy path, and then in each test, we change one
    // parameter that clearly aligns with the name of the test.

    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name }); // When key and value are same, then only one time will be enough.
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();
    
      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {
    it.todo('should return 401 if client is not logged in');
    it.todo('should return 400 if invalid genre ID given');
    it.todo('should return 400 if invalid genre information, min');
    it.todo('should return 400 if invalid genre information, max');
    it.todo('should return 404 if given genre cannot be found');
    it.todo('should save updated genre information');
    it.todo('should return genre with updated data');
  });

  describe('DELETE /:id', () => {
    it.todo('should return 401 if client is not logged in');
    it.todo('should return 4xx (error) if client is not admin user');
    it.todo('should return 400 if invalid genre ID given');
    it.todo('should return 404 if given genre cannot be found');
    it.todo('should return genre with updated data');
  });

});
const {Rental} = require('../../models/rental')
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');

let server;

describe('/api/returns', () => {  
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
    .post('/api/returns')
    .set('x-auth-token', token)
    .send({ customerId, movieId });
  }

  beforeEach(async () => { 
    token = new User().generateAuthToken();
    server = require('../../index');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });

  afterEach(async () => { 
    await server.close(); 
    await Rental.deleteMany();
  });

  // Return 401 if client is not logged in
  it('should return 401 if client not logged in', async () => {
    token = '';
    const res = await exec();

    expect(res.status).toBe(401);
  })

  // Return 400 if customerId in not provided
  it('should return 400 if customerId is not provided', async () => {
    customerId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  })

  // Return 400 if movieId in not provided
  it('should return 400 if movieId is not provided', async () => {
    movieId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  })

  // Return 404 if rental found this customer/movie
  // Return 400 if rental already processed
  // Return 200 if valid request
  // Set return date
  // Calculate rental fee
  // Increase the stock
  // Return the rental
});
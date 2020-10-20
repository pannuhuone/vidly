const {Rental} = require('../../models/rental')
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');

describe('/api/returns', () => {  
  let server;
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
        dailyRentalRate: 2,
      }
    });
    await rental.save();
  });

  afterEach(async () => { 
    await server.close(); 
    await Rental.deleteMany();
  });

  // Return 401 if client is not logged in
  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  // Return 400 if customerId in not provided
  it('should return 400 if customerId is not provided', async () => {
    customerId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 400 if movieId in not provided
  it('should return 400 if movieId is not provided', async () => {
    movieId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 404 if rental found this customer/movie
  it('should return 404 if rental cannot be found for the customer/movie', async () => {
    await Rental.deleteMany();
    const res = await exec();

    expect(res.status).toBe(404);
  });

  // Return 400 if rental already processed
  it('should return 400 if rental already processed', async () => {
    // await Rental.updateOne({ 'movie._id': movieId }, { dateReturned: Date.now() });
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 200 if valid request
  it('should return 200 if valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  // Set return date
  it('should set the returnDate if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(res.status).toBe(200);
    expect(rentalInDb).toHaveProperty('dateReturned');
    expect(diff).toBeLessThan(10 * 1000);
  });

  // Calculate rental fee (numberOfDays * movie.dailyRentalRate)
  // Increase the stock
  // Return the rental
});
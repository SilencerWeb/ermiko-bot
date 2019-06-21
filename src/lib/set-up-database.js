const mongoose = require('mongoose');


const setUpDatabase = () => {
  mongoose.connect(
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_NAME}-cqxka.mongodb.net/${process.env.NODE_ENV}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
    },
  );

  const database = mongoose.connection;

  database.on('error', (error) => {
    console.log('Error on connecting to the database!');
    console.log(`Error message: ${error.message}`);
  });

  database.once('open', () => console.log('Database is successfully connected!'));
};


module.exports = { setUpDatabase };

/* eslint-disable no-undef */
import { readFileSync } from 'fs';
import 'colors';
import { config } from 'dotenv';
import { ProductModel } from '../../models/productModel.js';
import { mongoConnection } from '../../configuration/dbConnection.js';

config({ path: '../../config.env' });

// connect to DB
mongoConnection();

// Read data
const products = JSON.parse(readFileSync('D:/web/E-commerc-ts/server/utility/dummyData/products.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await ProductModel.create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}

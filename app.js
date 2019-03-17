const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();


mongoose.connect('mongodb://localhost:27017/GraphQL', { useNewUrlParser: true }, () => {
    console.log('Mongoose open for busniess')
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));


app.listen(4000, () => {
    console.log("Server Running on Port 4000")
});
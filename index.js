import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import models from './models';


const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')), { all: true });
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 5000;
const app = express();

// allow cross-origin requests
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  context: {
    models,
    // only bind owner to user 1 for now
    user: {
      id: 1,
    },
  },
}));

// force: true drop all tables before start then redo it
// models.sequelize.sync({ force: true }).then(() => {
models.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});

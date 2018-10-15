import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 5000;
const app = express();

const graphqlEndPoint = 'graphql'

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

// app.use(graphqlEndPoint, bodyParser.json(), graphqlExpress({ schema }));
// app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndPoint }));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
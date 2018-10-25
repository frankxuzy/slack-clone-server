import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import models from './models';
import { refreshTokens } from './utils/auth';

const SECRET = '98q34riunskjvb9e7wiqbdlksandf';
const SECRET2 = 'hqwkrj2983isubdf4893qkjeefowqrifhc90u4q5';
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')), { all: true });
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 5000;
const app = express();

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser);
// allow cross-origin requests
app.use(cors());

app.use('/graphql', graphqlHTTP(req => ({
  schema,
  graphiql: true,
  context: {
    models,
    SECRET,
    SECRET2,
    // req.user comes from app.use(addUser)
    user: req.user,
  },
})));

// force: true drop all tables before start then redo it
// models.sequelize.sync({ force: true }).then(() => {
models.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});

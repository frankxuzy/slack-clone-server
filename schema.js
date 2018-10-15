import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    h1: String
  }
`;

export default typeDefs;

import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    h1: String
  }

  type User {
    id: Int!
    username: String!
    email: String!
    team: [Team!]!
  }

  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
  }

  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
`;

export default typeDefs;

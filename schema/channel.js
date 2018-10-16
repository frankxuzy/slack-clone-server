export default `
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type Query {
    getChannel(id: Int!):Channel!
  }

  type Mutation {
    # setup default value of public is false
    createChannel(team_id: Int!, name: String!, public: Boolean=false): Boolean!
  }
`;

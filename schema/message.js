export default `
  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
    created_at: String!
  }

  type Query {
    messages(channel_id: Int!): [Message!]!
  }

  type Mutation {
    createMessage(channel_id: Int!, text: String!): Boolean!
  }

  type Subscription {
    newChannelMessage(channel_id: Int!): Message!
  }
`;

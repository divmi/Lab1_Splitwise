const graphql = require("graphql");
const UserRegistartion = require("./Model/UserRegistrationModel");
const { login } = require("./Mutation/login");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

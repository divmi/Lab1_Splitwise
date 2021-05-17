const graphql = require("graphql");
const { login } = require("./Mutation/login");
const { signUp } = require("./Mutation/signUp");
const { getGroup } = require("./Mutation/group");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const LoginUserType = new GraphQLObjectType({
  name: "Login",
  fields: () => ({
    token: { type: GraphQLString },
    _id: { type: GraphQLID },
    Name: { type: GraphQLString },
    Email: { type: GraphQLString },
    Currency: { type: GraphQLString },
    Timezone: { type: GraphQLString },
    Language: { type: GraphQLString },
    ContactNo: { type: GraphQLString },
    UserProfilePic: { type: GraphQLString },
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  })
});

const GroupType = new GraphQLObjectType({
  name: "Group",
  fields: () => ({
    _id: { type: GraphQLID },
    GroupName: { type: GraphQLString },
    GroupProfilePicture: { type: GraphQLString },
    GroupMemberInfo: {
      type: new GraphQLList(GroupMemberType),
      resolve(parent, args) {
        console.log("Result", parent.GroupMemberInfo);
        return parent.GroupMemberInfo;
      }
    }
  })
});

const GroupMemberType = new GraphQLObjectType({
  name: "MemberInfo",
  fields: () => ({
    _id: { type: GraphQLID },
    ID: { type: LoginUserType },
    Accepted: { type: GraphQLBoolean }
  })
});

const StatusType = new GraphQLObjectType({
  name: "Status",
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query",
  fields: {
    group: {
      type: new GraphQLList(GroupType),
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const data = await getGroup(args._id);
        return data;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    login: {
      type: LoginUserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        let data = await login(args);
        console.log(data);
        return data;
      }
    }
  },
  fields: {
    signUp: {
      type: LoginUserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        return await signUp(args);
      }
    }
  }
  // fields: {
  //   createGroup: {
  //     type: StatusType,
  //     args: {
  //       data: { type: GraphQLObjectType }
  //     },
  //     async resolve(parent, args) {
  //       return await signUp(args);
  //     }
  //   }
  // }
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

module.exports = schema;

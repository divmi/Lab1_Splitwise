const graphql = require("graphql");
const { login, updateProfile } = require("./Mutation/login");
const { signUp } = require("./Mutation/signUp");
const { addGroup, editGroup } = require("./Mutation/addGroup");
const { settleUp } = require("./Mutation/settleUp");
const {
  insert_TransactionForUserAndGroup
} = require("./Mutation/addTransactionToDatabase");
const {
  getGroup,
  getDetailTransaction,
  getOwsGetsDetail,
  getGroupMemberName,
  getAllUser
} = require("./Query/group");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
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

const TransactionDetail = new GraphQLObjectType({
  name: "Transaction",
  fields: () => ({
    _id: { type: GraphQLID },
    TransactionDetail: { type: GraphQLString },
    MemberID: { type: LoginUserType },
    GroupID: { type: GroupType },
    Amount: { type: GraphQLFloat },
    Time: { type: GraphQLString }
  })
});

const StatusType = new GraphQLObjectType({
  name: "status",
  fields: () => ({
    status: { type: GraphQLInt }
  })
});

const GetOwsDetail = new GraphQLObjectType({
  name: "GetOwsDetail",
  fields: () => ({
    _id: { type: GraphQLID },
    MemberOws: { type: LoginUserType },
    MemberGets: { type: LoginUserType },
    GroupID: { type: GroupType },
    Amount: { type: GraphQLFloat }
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
    },
    groupDetailInfo: {
      type: new GraphQLList(TransactionDetail),
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const data = await getDetailTransaction(args._id);
        console.log(data);
        return data;
      }
    },
    owsGetDetail: {
      type: new GraphQLList(GetOwsDetail),
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const data = await getOwsGetsDetail(args._id);
        console.log(data);
        return data;
      }
    },
    groupMemberName: {
      type: new GraphQLList(GroupType),
      args: { _id: { type: GraphQLID } },
      async resolve(parent, args) {
        const data = await getGroupMemberName(args._id);
        console.log(data);
        return data;
      }
    },
    getAllUser: {
      type: new GraphQLList(LoginUserType),
      args: { Name: { type: GraphQLString } },
      async resolve(parent, args) {
        const data = await getAllUser(args);
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
    },
    insertTransaction: {
      type: StatusType,
      args: {
        transactionDetail: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        groupID: { type: GraphQLID },
        memberID: { type: GraphQLID }
      },
      async resolve(parent, args) {
        console.log(args);
        let data = await insert_TransactionForUserAndGroup(args);
        console.log(data);
        return data;
      }
    },
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
    },
    updateProfile: {
      type: StatusType,
      args: {
        _id: { type: GraphQLID },
        Name: { type: GraphQLString },
        Email: { type: GraphQLString },
        Currency: { type: GraphQLString },
        Timezone: { type: GraphQLString },
        Language: { type: GraphQLString },
        ContactNo: { type: GraphQLString },
        UserProfilePic: { type: GraphQLString },
        status: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const data = await updateProfile(args);
        console.log(data);
        return data;
      }
    },
    addGroup: {
      type: StatusType,
      args: {
        GroupName: { type: GraphQLString },
        GroupProfilePicture: { type: GraphQLString },
        GroupCreatedBy: { type: GraphQLID },
        GroupMemberInfo: { type: GraphQLList(GraphQLID) }
      },
      async resolve(parent, args) {
        return await addGroup(args);
      }
    },
    editGroup: {
      type: StatusType,
      args: {
        GroupName: { type: GraphQLString },
        GroupProfilePicture: { type: GraphQLString },
        GroupMemberInfo: { type: GraphQLList(GraphQLID) }
      },
      async resolve(parent, args) {
        return await editGroup(args);
      }
    },
    settleUp: {
      type: StatusType,
      args: {
        MemberID: { type: GraphQLID },
        Amount: { type: GraphQLFloat },
        SettleUpWith: { type: GraphQLID },
        GroupID: { type: GraphQLID }
      },
      async resolve(parent, args) {
        return await addGroup(args);
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

module.exports = schema;


export const mutation = `
    signUp(fullName: String!, mobileNumber: String!, email: String!, dateOfBirth: String!, password: String!): SignUpResponse!
    signIn(email: String!, password: String!): SignUpResponse!
    sendMsg(senderId : String! , recieverId : [ID!]! , content : String!,groupName : String) :Message!
    deleteUser(senderId : String!) : User!
    deleteMsgOfChatroom(senderId : String!,recieverId : String!) : DeleteResponse
    inGroup(userIds : [ID]!, adminId: String!,groupName : String!) : Group
    
`;

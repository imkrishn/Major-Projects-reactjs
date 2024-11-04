export const queries = `
        getCurrentLoggedInUser: User
        getAllUsers: [User!]!
        getAllMessages(senderId: String!, recieverId: [ID!]!,groupName : String): [Message!] 
        getAllGroup: [Group!]!
`;

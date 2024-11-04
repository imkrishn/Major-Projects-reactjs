"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `
        getCurrentLoggedInUser: User
        getAllUsers: [User!]!
        getAllMessages(senderId: String!, recieverId: [ID!]!,groupName : String): [Message!] 
        getAllGroup: [Group!]!
`;

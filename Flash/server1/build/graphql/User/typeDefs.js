"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `
    type User{
        id: ID!,
        fullName: String!
        email: String!
        mobileNumber: String!
        dateOfBirth: String!
    }

    type Message{
        id :String!
        content : String!
        chatRoomId : String!
        senderId : String!
        creationTime : String!
    }

    type ChatRoom{
        id : String!
        name : String!
        users : [User!]!
    }

    type DeleteResponse {
        success: Boolean!
    }

    type Group {
        id: ID!
        name: String!
        adminId : String!
        users: [User!]!  # Assuming each group has multiple users
    }
    

    
`;
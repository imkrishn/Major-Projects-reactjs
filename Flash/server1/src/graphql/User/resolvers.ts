import UserService, { createUserPayload, getMessages, sendMessages, signInUserPayload } from "../../services/user";
import { Response } from "express";

const queries = {
    getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
        try {

            if (!context || !context.user) {
                throw new Error("User not authenticated");
            }
            const user = await UserService.getUserById(context.user.id);
            //console.log(user);


            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (err) {
            console.error("Error retrieving current user:", err);
            return { success: false, message: err || "Failed to retrieve user" };
        }
    },

    getAllUsers: async () => {
        try {
            const users = await UserService.getAllUsers();
            return users;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Could not fetch users");
        }
    },

    getAllMessages: async (_: any, payload: getMessages) => {
        try {
            const messages = await UserService.fetchConversation(payload);
            return messages

        } catch (err) {
            console.log(err);

        }
    },

    getAllGroup: async () => {
        try {
            const chatRooms = await UserService.getAllGroup();
            return chatRooms
        } catch (err) {
            console.log(err);

        }
    }



};

const mutations = {
    signUp: async (_: any, payload: createUserPayload) => {
        try {
            const res = await UserService.signUp(payload);
            return { success: true, message: "New user created successfully", data: res };
        } catch (err) {
            console.error("Error during sign-up:", err);
            return { success: false, message: "Failed to create user. Email/Number may already be registered." };
        }
    },


    signIn: async (_: any, payload: signInUserPayload, { res }: { res: Response }) => {
        try {
            const token = await UserService.signIn(payload);

            res.cookie("token", token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
            });


            return { success: true, message: "User signed in successfully", token };
        } catch (err) {
            console.error("Error during sign-in:", err);

            return { success: false, message: "Failed to sign in. Invalid credentials or server error." };
        }
    },

    sendMsg: async (_: any, payload: sendMessages, { io }: { io: any }) => {
        try {

            const message = await UserService.sendMessage(payload);

            // Handle multiple recipients by iterating over each receiver ID
            const receiverIds = Array.isArray(payload.recieverId) ? payload.recieverId : [payload.recieverId];

            for (const receiverId of receiverIds) {
                const receiverSocketId = await UserService.getSocketIdByUserId(receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receiveMessage", {
                        senderId: payload.senderId,
                        content: payload.content,
                        timestamp: new Date(),
                    });
                } else {
                    console.log(`Recipient with ID ${receiverId} is not connected or socketId not found.`);
                }
            }

            return message;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },


    deleteUser: async (_: any, { senderId }: { senderId: string }) => {
        try {
            const deletedUser = UserService.deleteUsersById(senderId);
            return deletedUser;
        } catch (err) {
            console.log(err);

        }
    },

    deleteMsgOfChatroom: async (_: any, { senderId, recieverId }: { senderId: string, recieverId: string }) => {
        try {
            if (senderId && recieverId) {
                await UserService.deleteMsgOfChatroom(senderId, recieverId);
                return { success: true }
            } else {
                return { success: false }
            }
        } catch (err) {
            console.log(err);
            return { success: false }
        }
    },

    inGroup: async (_: any, { userIds, adminId, groupName }: { userIds: string[], adminId: string, groupName: string }, { io }: { io: any }) => {
        try {
            // Step 1: Create or find the group chat room
            const chatRoom = await UserService.findOrCreateGroupChatRoom(userIds, groupName, adminId);

            // Step 2: Emit the 'receiveGroup' event to each user in the group
            for (const userId of userIds) {
                try {
                    const userSocketId = await UserService.getSocketIdByUserId(userId);

                    if (userSocketId) {
                        io.to(userSocketId).emit("receiveGroup", {
                            userId,
                            groupName: chatRoom.name,
                            chatRoomId: chatRoom.id,
                            adminId: chatRoom.adminId,
                            timestamp: new Date(),
                        });
                    } else {
                        console.log(`Socket ID not found for user ID: ${userId}`);
                    }
                } catch (error) {
                    console.error(`Failed to notify user ${userId} about group creation:`, error);
                }
            }

            return chatRoom;
        } catch (err) {
            console.error("Error creating or finding group chat room:", err);
            throw new Error("Failed to create or notify group");
        }
    }





};

export const resolvers = { queries, mutations };

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../services/user"));
const socketIo = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(`User connected: ${socket.id}`);
    socket.on("register", (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (userId) {
                yield user_1.default.updateSocketId(userId, socket.id);
                console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
            }
        }
        catch (error) {
            console.error(`Error updating socket ID for user ${userId}:`, error);
        }
    }));
    socket.on("newMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, recieverId, content, chatRoomId } = data;
        for (const reciever of recieverId) {
            try {
                const recieverSocketId = yield user_1.default.getSocketIdByUserId(reciever);
                if (recieverSocketId) {
                    // Emit the message to the specific receiver
                    io.to(recieverSocketId).emit("receiveMessage", {
                        senderId,
                        content,
                        chatRoomId,
                        timestamp: new Date(),
                    });
                }
                else {
                    console.log(`Recipient with ID ${reciever} is not connected or socketId not found.`);
                }
            }
            catch (error) {
                console.error(`Failed to send message to recipient with ID ${reciever}:`, error);
            }
        }
    }));
    /* socket.on("newGroup", async (data: any) => {
      const { userIds, adminId, groupName } = data;
  
      try {
        // Step 1: Create or find the group chat room
        const chatRoom = await UserService.findOrCreateGroupChatRoom(userIds, groupName, adminId);
  
        // Step 2: Notify each user in the group
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
            console.error(`Failed to notify user ${userId} about new group creation:`, error);
          }
        }
      } catch (error) {
        console.error("Error processing new group creation request:", error);
      }
    }); */
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`User disconnected: ${socket.id}`);
        try {
            yield user_1.default.updateSocketId(socket.id, null);
        }
        catch (error) {
            console.error(`Error clearing socket ID for disconnected user ${socket.id}:`, error);
        }
    }));
});
exports.default = socketIo;

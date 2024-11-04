import UserService from '../services/user';


const socketIo = async (socket: any, io: any) => {
  //console.log(`User connected: ${socket.id}`);

  socket.on("register", async (userId: string) => {
    try {
      if (userId) {
        await UserService.updateSocketId(userId, socket.id);
        console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
      }
    } catch (error) {
      console.error(`Error updating socket ID for user ${userId}:`, error);
    }
  });

  socket.on("newMessage", async (data: any) => {
    const { senderId, recieverId, content, chatRoomId } = data;

    for (const reciever of recieverId) {
      try {
        const recieverSocketId = await UserService.getSocketIdByUserId(reciever);

        if (recieverSocketId) {
          // Emit the message to the specific receiver
          io.to(recieverSocketId).emit("receiveMessage", {
            senderId,
            content,
            chatRoomId,
            timestamp: new Date(),
          });
        } else {
          console.log(`Recipient with ID ${reciever} is not connected or socketId not found.`);
        }
      } catch (error) {
        console.error(`Failed to send message to recipient with ID ${reciever}:`, error);
      }
    }
  });

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


  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
    try {

      await UserService.updateSocketId(socket.id, null as any);
    } catch (error) {
      console.error(`Error clearing socket ID for disconnected user ${socket.id}:`, error);
    }
  });
};

export default socketIo;
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, gql } from "@apollo/client";

import SendMsgBox from "./SendMsgBox";
import RecieveMsgBox from "./RecieveMsgBox";
import socket from "../services/Socket.io/socket";

const GET_ALL_MESSAGES = gql`
  query GetAllMessages($senderId: String!, $recieverId: [ID!]!, $groupName: String) {
    getAllMessages(senderId: $senderId, recieverId: $recieverId, groupName: $groupName) {
      id
      content
      chatRoomId
      senderId
      creationTime
    }
  }
`;

const ChatBox_Body = () => {
    const user = useSelector((state) => state.currentUser.data);
    const recieverId = useSelector((state) => state.recieverUser.recieverId);
    const senderId = user?.id;
    const [messages, setMessages] = useState([]);
    const chatBoxRef = useRef(null);
    const messagesRef = useRef([]);
    const currentMsg = useSelector((state) => state.currentMsg);
    const isDarker = useSelector((state) => state.isDarker);
    const chatType = useSelector((state) => state.chatType);
    const group = useSelector((state) => state.groupUser);

    const groupName = group?.name;
    const groupIds = group?.users.map((user) => user.id) || [];
    const groupRecieverIds = groupIds.filter((user) => user !== senderId);
    const formattedRecieverId = chatType === "single" ? [recieverId] : groupRecieverIds;

    const { data, loading, error } = useQuery(GET_ALL_MESSAGES, {
        variables: {
            senderId,
            recieverId: formattedRecieverId,
            groupName: chatType === "group" ? groupName : undefined,
        },
        skip: !senderId || !formattedRecieverId.length,
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setMessages(data?.getAllMessages || []);
        },
        onError: (error) => {
            console.error("Error retrieving messages:", error);
        },
    });


    useEffect(() => {
        console.log("Setting up socket listener");

        const handleReceiveMessage = (incomingMessage) => {
            console.log("Received message:", incomingMessage);
            messagesRef.current = [...messagesRef.current, incomingMessage];
            setMessages(messagesRef.current); // Ensure you're using the latest messages
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket]);


    useEffect(() => {
        if (currentMsg) {
            setMessages((prevMessages) => [...prevMessages, currentMsg]);
        }
    }, [currentMsg]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTo({
                top: chatBoxRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    if (!senderId) return <div className="flex-center text-white">Please log in to see the messages.</div>;
    if (loading) return <div className="flex-center text-white">Loading messages...</div>;
    if (error) return <div className="flex-center text-white">Error loading messages: {error.message}</div>;

    return (
        <div ref={chatBoxRef} className="chatBox_body overflow-y-scroll overflow-x-hidden h-[27.42rem] p-4 flex flex-col gap-3" aria-live="polite">
            {messages.map((msg, index) =>
                (msg.senderId === senderId || typeof msg === "string") ? (
                    <SendMsgBox key={msg.id || `${index}-${msg.creationTime}`} message={msg} isDarker={isDarker} />
                ) : (
                    <RecieveMsgBox key={msg.id || `${index}-${msg.creationTime}`} message={msg} isDarker={isDarker} />
                )
            )}
        </div>
    );
};

export default ChatBox_Body;

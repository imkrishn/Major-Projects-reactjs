import { useEffect, useState } from "react";
import FileViewer from "./FileViewer";
import { useMutation, gql } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import socket from "../services/Socket.io/socket";
import { setCurrentMsg } from "../redux/slices/currentMsg";


const SEND_MSG = gql`
  mutation SendMsg($senderId: String!, $recieverId: [ID!]!, $content: String!, $groupName: String) {
  sendMsg(senderId: $senderId, recieverId: $recieverId, content: $content, groupName: $groupName) {
    id
    content
    chatRoomId
    senderId
    creationTime
  }
}
`;

const ChatBox_Tool = () => {
    const isDarker = useSelector((state) => state.isDarker);
    const chatType = useSelector((state) => state.chatType);
    const user = useSelector((state) => state.currentUser.data);
    const senderId = user?.id;
    const recieverId = useSelector((state) => state.recieverUser.recieverId);
    const group = useSelector((state) => state.groupUser);


    const groupName = group?.name;
    const groupIds = group?.users.map((user) => user.id) || [];
    const groupRecieverIds = groupIds.filter((user) => user !== senderId);




    const [view, setView] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    const [sendMsg] = useMutation(SEND_MSG, {
        onCompleted: (data) => {
            console.log("Message sent successfully:", data);
            setMessage("");
        },
        onError: (error) => {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        },
    });

    useEffect(() => {
        if (senderId) {
            socket.emit("register", senderId);
        }
        return () => {
            socket.off("register");
        };
    }, [senderId]);



    const handleMsgSend = (e) => {
        const msg = e.target.value;
        setMessage(msg);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setView(false);
    };

    const handleSubmitBtn = async (e) => {
        e.preventDefault();

        const recipientIds = chatType === "group" ? groupRecieverIds : [recieverId];

        if (message) {
            dispatch(setCurrentMsg(message))
        }

        if (!senderId) {
            alert("Sender ID is missing.");
            return;
        }
        if (!recipientIds) {
            alert("Receiver ID is missing.");
            return;
        }
        if (!message) {
            alert("Message cannot be empty.");
            return;
        }



        if (!recipientIds.length) {
            alert("Receiver ID(s) missing for the selected chat type.");
            return;
        }

        try {

            const { data } = await sendMsg({
                variables: {
                    senderId,
                    recieverId: recipientIds,
                    content: message,
                    groupName: chatType === "group" ? groupName : undefined
                },
            });

            if (data?.sendMsg) {
                socket.emit("newMessage", {
                    senderId,
                    recieverId: recipientIds,
                    content: message,
                    chatRoomId: data.sendMsg.chatRoomId,
                });
            }


            setMessage("");
            setSelectedFile(null);
            setView(true);


        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const triggerCameraInput = () => {
        document.getElementById("camera-upload").click();
    };

    const triggerFileInput = () => {
        document.getElementById("file-upload").click();
    };

    return (
        <div className="chatBox_tool ">
            <form onSubmit={handleSubmitBtn} className="bg-slate-900 grid-20-73-7-col h-full">
                <div className="chatbox_tool-attach flex-center gap-4">
                    <div className="chatbox_tool-attach--file cursor-pointer active:scale-[0.85]" onClick={triggerFileInput}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="3rem" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
                            <path d="M448-201.33h66.67V-391l76 76 46.66-47L480-516.67l-156 156L371-314l77-77v189.67ZM226.67-80q-27 0-46.84-19.83Q160-119.67 160-146.67v-666.66q0-27 19.83-46.84Q199.67-880 226.67-880H574l226 226v507.33q0 27-19.83 46.84Q760.33-80 733.33-80H226.67Zm314-542.67v-190.66h-314v666.66h506.66v-476H540.67Zm-314-190.66v190.66-190.66 666.66-666.66Z" />
                        </svg>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Hide the default file input
                        />
                    </div>
                    <div className="chatbox_tool-attach--camera cursor-pointer active:scale-[0.85]" onClick={triggerCameraInput}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="3rem" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
                            <path d="M479.67-264.67q73.33 0 123.5-50.16 50.16-50.17 50.16-123.5 0-73.34-50.16-123.17-50.17-49.83-123.5-49.83-73.34 0-123.17 49.83t-49.83 123.17q0 73.33 49.83 123.5 49.83 50.16 123.17 50.16Zm0-66.66q-45.67 0-76-30.67-30.34-30.67-30.34-76.33 0-45.67 30.34-76 30.33-30.34 76-30.34 45.66 0 76.33 30.34 30.67 30.33 30.67 76 0 45.66-30.67 76.33t-76.33 30.67ZM146.67-120q-27 0-46.84-19.83Q80-159.67 80-186.67v-502q0-26.33 19.83-46.5 19.84-20.16 46.84-20.16h140L360-840h240l73.33 84.67h140q26.34 0 46.5 20.16Q880-715 880-688.67v502q0 27-20.17 46.84Q839.67-120 813.33-120H146.67Zm0-66.67h666.66v-502H642.67l-73-84.66H390.33l-73 84.66H146.67v502ZM480-438Z" />
                        </svg>
                        <input
                            id="camera-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            capture="user"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="chatbox_tool-attach--mic cursor-pointer active:scale-[0.85]">
                        <svg xmlns="http://www.w3.org/2000/svg" height="3rem" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
                            <path d="M480-415.33q-45.33 0-76.33-32.28t-31-78.39v-247.33q0-44.45 31.29-75.56 31.3-31.11 76-31.11 44.71 0 76.04 31.11 31.33 31.11 31.33 75.56V-526q0 46.11-31 78.39T480-415.33Zm0-232ZM446.67-120v-131.67q-105.34-12-176-90.33Q200-420.33 200-526h66.67q0 88.33 62.36 149.17Q391.38-316 479.86-316q88.47 0 150.97-60.83 62.5-60.84 62.5-149.17H760q0 105.67-70.67 184-70.66 78.33-176 90.33V-120h-66.66ZM480-482q17.67 0 29.17-12.83 11.5-12.84 11.5-31.17v-247.33q0-17-11.69-28.5-11.7-11.5-28.98-11.5t-28.98 11.5Q445-556 445-539.33v247.33q0 18.33 11.5 31.17 11.5 12.83 29.17 12.83Zm0 0-2 2Z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <input
                        type="text"
                        value={message}
                        onChange={handleMsgSend}
                        className={`chatbox_tool-input w-full h-full size-8 px-3 outline-none ${isDarker ? 'isDarkMode' : 'isLightMode'}`}
                        placeholder="Enter the message"
                        name="chatbox_tool-input"
                    />
                </div>

                <button type="submit" className="flex-center chatbox_tool-sendBtn ">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m600-200-56-57 143-143H300q-75 0-127.5-52.5T120-580q0-75 52.5-127.5T300-760h20v80h-20q-42 0-71 29t-29 71q0 42 29 71t71 29h387L544-624l56-56 240 240-240 240Z" /></svg>
                </button>

            </form>
            {!view && <FileViewer theFile={selectedFile} handleView={() => setView(true)} handleSubmit={handleSubmitBtn} />}
        </div>
    );
};

export default ChatBox_Tool;

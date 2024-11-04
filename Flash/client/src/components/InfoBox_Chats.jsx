import { useDispatch } from 'react-redux';
import { setRecieverUser } from '../redux/slices/recieverUser';
import { useSelector } from "react-redux";
import { setChatType } from '../redux/slices/chatType';

const InfoBox_Chats = ({ user }) => {
    const dispatch = useDispatch();
    const isDarker = useSelector((state) => state.isDarker);

    const handleSelectUser = () => {
        dispatch(setRecieverUser({ recieverId: user?.id, recieverName: user?.fullName }));
        dispatch(setChatType("single"));
    };



    return (
        <div className="infoBox-body_chat grid-80-20-col w-full gap-2 select-none px-4  " >
            <div
                className={`infoBox-body_chatType cursor-pointer px-4 py-2 font-bold rounded-lg ${isDarker ? 'isLightMode' : 'isDarkMode'}`}
                onClick={handleSelectUser}
            >
                {user?.fullName || "Unknown User"}
            </div>
            <svg
                className="infoBox-body_chat_dp cursor-pointer h-full bg-slate-700 rounded-full active:bg-slate-800"
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#FFFFFF"
            >
                <path d="M222-255q63-40 124.5-60.5T480-336q72 0 134 20.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm-.21 370q-83.15 0-156.28-31.5t-127.22-86Q142-252 111-324.84 80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.5t-127.13 86Q562.74-80 479.6-80Z" />
            </svg>
        </div>
    );
};

export default InfoBox_Chats;

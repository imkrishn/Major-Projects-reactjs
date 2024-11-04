import InfoBox_GroupChat from "./InfoBox_GroupChat";
import { useQuery, gql } from '@apollo/client';
import { useSelector, useDispatch } from "react-redux";
import { fetchLoggedInUser } from "../redux/slices/loggedInUser";
import { useEffect, useState } from "react";
import InfoBox_Chats from "./InfoBox_Chats";
import InfoBox_Users from "./InfoBox_Users";
import InfoBox_Group_Add from "./InfoBox_Group_Add";

const GET_USERS = gql`
    query GetAllUsers {
        getAllUsers {
            id
            fullName
            email
            mobileNumber
            dateOfBirth
        }
    }
`;



const InfoBox_Body = () => {

    const isDarker = useSelector((state) => state.isDarker);
    const currentUser = useSelector((state) => state.currentUser.data);
    const newUser = useSelector((state) => state.addUser);

    const [click, setClick] = useState("chats");
    const [chats, setChats] = useState(() => {
        const storedChats = localStorage.getItem("chats");
        return storedChats ? JSON.parse(storedChats) : [];
    });
    const [groups, setGroups] = useState(() => {
        const storedGroupChats = localStorage.getItem("groups");
        return storedGroupChats ? JSON.parse(storedGroupChats) : [];
    })


    const { data, loading, error } = useQuery(GET_USERS, {
        fetchPolicy: 'cache-first',
    });



    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchLoggedInUser());
    }, [dispatch]);



    useEffect(() => {
        const storedChats = localStorage.getItem("chats");
        if (storedChats) {
            setChats(JSON.parse(storedChats));
        }
    }, []);

    useEffect(() => {
        if (newUser.id) {
            setChats((prevChats) => {
                const existingUser = prevChats.find(chat => chat.id === newUser.id);
                if (!existingUser) {
                    return [...prevChats, newUser];
                }
                return prevChats;
            });
        }
        setClick("chats")
    }, [newUser]);

    // Save chats to localStorage whenever chats changes
    useEffect(() => {
        localStorage.setItem("chats", JSON.stringify(chats));
    }, [chats]);

    // Save groupChats to localStorage whenever Groups changes

    useEffect(() => {
        localStorage.setItem("groups", JSON.stringify(groups));
    }, [groups])

    if (currentUser === null) {
        return <div className="flex-center">Loading ...</div>;
    }

    if (loading) return <p className="flex-center">Loading ...</p>;
    if (error) return <p className="flex-center">Error fetching users</p>;
    if (!data || !data.getAllUsers) return <p className="flex-center">No Users</p>;




    return (
        <div className={`infoBox_body flex-center flex-col h-[32rem] pb-4 ${isDarker ? 'bg-slate-600' : 'bg-slate-300'}`}>
            <div className={`flex-center w-[95%]`}>
                <svg onClick={() => setClick("chats")} className={`w-1/2 rounded-tr-3xl rounded-tl-3xl mr-4 cursor-pointer active:scale-[0.99] ${click === "chats" ? 'isDarkMode' : 'isLightMode'}`} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF">
                    <path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.92 44.69q31.3 14.13 50.19 40.97Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z" />
                </svg>
                <svg onClick={() => setClick("groupChats")} className={`w-1/2 rounded-tr-3xl rounded-tl-3xl cursor-pointer active:scale-[0.99] ${click === "groupChats" ? 'isDarkMode' : 'isLightMode'}`} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF">
                    <path d="M0-240v-53q0-38.57 41.5-62.78Q83-380 150.38-380q12.16 0 23.39.5t22.23 2.15q-8 17.35-12 35.17-4 17.81-4 37.18v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-19.86-3.5-37.43T765-377.27q11-1.73 22.17-2.23 11.17-.5 22.83-.5 67.5 0 108.75 23.77T960-293v53H780Zm-480-60h360v-6q0-37-50.5-60.5T480-390q-79 0-129.5 23.5T300-305v5ZM149.57-410q-28.57 0-49.07-20.56Q80-451.13 80-480q0-29 20.56-49.5Q121.13-550 150-550q29 0 49.5 20.5t20.5 49.93q0 28.57-20.5 49.07T149.57-410Zm660 0q-28.57 0-49.07-20.56Q740-451.13 740-480q0-29 20.56-49.5Q781.13-550 810-550q29 0 49.5 20.5t20.5 49.93q0 28.57-20.5 49.07T809.57-410ZM480-480q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm.35-60Q506-540 523-557.35t17-43Q540-626 522.85-643t-42.5-17q-25.35 0-42.85 17.15t-17.5 42.5q0 25.35 17.35 42.85t43 17.5ZM480-300Zm0-300Z" />
                </svg>
            </div>

            {(click === "chats" || click === "groupChats" || click === "groupCreate") && (
                <div className={`infoBox_body_chatArea flex overflow-y-scroll items-center py-4 px-4 flex-col gap-4 w-[95%] h-full ${isDarker ? 'isDarkMode' : 'isLightMode'}`}>
                    {click === "chats" &&
                        chats.map((user) => (
                            <InfoBox_Chats key={user.id} user={user} />
                        ))}
                    {click === "groupChats" && (
                        <>
                            {groups.map((group) => (<InfoBox_GroupChat group={group} key={`${group.name}-${group.adminId}`} setGroups={setGroups} />))}
                            <div onClick={() => setClick("groupCreate")} className="infoBox_group_create border px-4 py-2 w-full text-center select-none mt-8 rounded-lg cursor-pointer active:scale-[0.95]"> Create +</div>
                        </>
                    )}

                    {click === "groupCreate" && <InfoBox_Group_Add users={data.getAllUsers} group={setGroups} />}

                </div>
            )}

            {click === "users" && (
                <div className={`infoBox_userlist overflow-y-scroll h-full w-[95%] ${isDarker ? 'isDarkMode' : 'isLightMode'}`}>
                    {data.getAllUsers.map((user) => (
                        user.id !== currentUser.id && <InfoBox_Users key={user.id} user={user} />
                    ))}
                </div>
            )}

            <svg onClick={() => setClick("users")} className="fixed bottom-4 right-[25%] bg-green-600 cursor-pointer active:scale-[0.95]" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF"><path d="M446.67-280h66.66v-166.67H680v-66.66H513.33V-680h-66.66v166.67H280v66.66h166.67V-280Zm-260 160q-27 0-46.84-19.83Q120-159.67 120-186.67v-586.66q0-27 19.83-46.84Q159.67-840 186.67-840h586.66q27 0 46.84 19.83Q840-800.33 840-773.33v586.66q0 27-19.83 46.84Q800.33-120 773.33-120H186.67Z" /></svg>
        </div>
    );
};

export default InfoBox_Body;


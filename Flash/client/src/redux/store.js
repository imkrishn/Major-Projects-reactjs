import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/loggedInUser';
import recieverUser from './slices/recieverUser';
import currentMsgSlice from './slices/currentMsg';
import addUserSlice from './slices/addUser';
import groupUserSlice from './slices/groupUser';
import isDarkerSlice from './slices/isDarker';
import chatTypeSlice from './slices/chatType';

export const store = configureStore({
    reducer: {
        isDarker: isDarkerSlice,
        currentUser: userSlice,
        recieverUser: recieverUser,
        currentMsg: currentMsgSlice,
        addUser: addUserSlice,
        groupUser: groupUserSlice,
        chatType: chatTypeSlice

    }
});

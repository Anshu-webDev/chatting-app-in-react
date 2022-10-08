import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleSearch = async () => {
        const q = query(collection(db, "users"), where("displayName", "==", username))
        try {
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            })
        } catch (err) {
            setErr(true);
        }
    }

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch()
    };

    const handleSelect = async (u) => {

        // check weather the group chat in firestore exist or not, if not create
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId))

            if (!res.exists()) {
                // create a chat in chats collections
                await setDoc(doc(db, "chats", combinedId), { messages: [] })

                // create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp()
                })

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp()
                })

                dispatch({ type: "CHANGE_USER", payload: u })
            }
        } catch (err) {
            console.log(err);
        }

        setUser(null);
        setUsername("");

    }

    return (
        <div className='search'>
            <div className='searchForm'>
                <input type='text' placeholder='Find a user'
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {err && <span>user not found!</span>}
            {user && (<div className='userChat' onClick={() => handleSelect(user)}>
                <img src={user.photoURL}
                    alt='' />
                <div className='userChatInfo'>
                    <span>{user.displayName}</span>
                </div>
            </div>)}
        </div>
    )
}

export default Search
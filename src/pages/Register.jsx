import React, { useState } from 'react'
import Add from '../assets/img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const storageRef = ref(storage, displayName);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        // update profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        // create user on firebase
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
                        //create empty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");

                    } catch (err) {
                        console.log("e", err);
                    }
                });
            });

            // const uploadTask = uploadBytesResumable(storageRef, file);

            // uploadTask.on(
            //     (error) => {
            //         console.log("error", error);
            //         setErr(true);
            //     },
            //     () => {
            //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            //             console.log("download url", downloadURL);
            //             await updateProfile(res.user, {
            //                 displayName,
            //                 photoURL: downloadURL,
            //             });
            //             await setDoc(doc(db, "users", res.user.uid), {
            //                 uid: res.user.uid,
            //                 displayName,
            //                 email,
            //                 photoURL: downloadURL,
            //             })
            //             await setDoc(doc(db, "userChats", res.user.id), {});
            //             navigate("/");
            //         });
            //     }
            // );
        } catch (err) {
            console.log("err", err);
            setErr(true);
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Anshu ChatApp</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>
                    <input type='text' placeholder='Display name' />
                    <input type='email' placeholder='email' />
                    <input type='password' placeholder='password' />
                    <input style={{ display: "none" }} type='file' id='file' />
                    <label htmlFor='file'>
                        <img src={Add} alt='' />
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign up</button>
                    {err && <span>something went wrong</span>}
                </form>
                <p>You do have a account? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    )
}

export default Register
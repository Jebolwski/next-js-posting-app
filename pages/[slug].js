import { async } from "@firebase/util";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import Comment from "../components/Comment";
import Message from "../components/message";
import { auth, db } from "../utils/firebase";

export default function Details(params) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [allMessages, setAllMessages] = useState([]);
  //!Send a message
  const sendMessage = async () => {
    //TODO if message is empty or not
    if (!document.querySelector(".message").value) {
      toast.error("Your comment is empty 😥", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      return;
    }
    //TODO if user is logged in
    if (user) {
      const docRef = doc(db, "posts", router?.query.id);
      await updateDoc(docRef, {
        comments: arrayUnion({
          message: document.querySelector(".message").value,
          avatar: user.photoURL,
          username: user.displayName,
          time: Timestamp.now(),
        }),
      });
      document.querySelector(".message").value = "";
    } else {
      toast.error("You are not logged in 😥", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      return;
    }
  };

  const getComments = async () => {
    const docRef = doc(db, "posts", router?.query.id);
    const docSnap = await onSnapshot(docRef, (snapshot) =>
      setAllMessages(snapshot.data().comments)
    );
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      {/* Main text */}
      <Message post={router.query} key={router?.query.id} />
      {/* Comment on post */}
      <div className="flex w-full my-4">
        <input
          type="text"
          className="message bg-gray-800 text-white rounded-bl-md rounded-tl-md w-full p-2"
          placeholder="Send a comment 😄"
          maxLength={160}
        />
        <button
          className="bg-teal-800 text-white font-medium px-2  rounded-br-md rounded-tr-md"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      <h2>Comments</h2>
      {allMessages?.map((message, index) => {
        return <Comment post={message} key={index} />;
      })}
    </div>
  );
}

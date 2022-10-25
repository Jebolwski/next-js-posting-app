import { db } from "../utils/firebase";
import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { auth } from "../utils/firebase";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

export default function Message(params) {
  const [currentUser, loading] = useAuthState(auth);
  const deletePost = async (uid) => {
    if (currentUser) {
      const docRef = doc(db, "posts", uid);
      await deleteDoc(docRef);
    }
  };
  return (
    <div className="shadow-md p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-3">
        <img src={params?.post.avatar} className="w-10 rounded-full" />
        <h2>{params?.post.username}</h2>
      </div>
      <div className="py-4">
        <p>{params?.post?.description}</p>
      </div>
      <Link
        href={{ pathname: `/${params?.post.id}`, query: { ...params.post } }}
        className="cursor-pointer"
      >
        <h4 className="cursor-pointer">
          {params.post.comments ? params.post.comments?.length : 0} comments
        </h4>
      </Link>
      {currentUser?.uid == params?.post.user ? (
        <div className="flex items-center gap-5 mt-3">
          <Link href={{ pathname: "/post", query: params.post }}>
            <button className="text-cyan-500 flex items-center gap-2">
              <AiFillEdit />
              Edit
            </button>
          </Link>
          <button
            className="text-red-500 flex items-center gap-2"
            onClick={() => deletePost(id)}
          >
            <BsTrash2Fill /> Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

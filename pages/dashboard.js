import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../utils/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/message";

export default function dashboard() {
  const [user, loading] = useAuthState(auth);
  const [allPosts, setAllPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push("/auth/login");
    }
    if (user) {
      const collectionRef = collection(db, "posts");
      const q = query(collectionRef, where("user", "==", user?.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAllPosts(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    }
  }, [user, loading]);
  return (
    <div>
      <h1 className="my-4 text-xl font-medium">Your posts</h1>
      {allPosts.map((post) => {
        return <Message post={post} key={post.id}></Message>;
      })}
      <div className="flex justify-center">
        <button
          onClick={() => auth.signOut()}
          className="mt-4 bg-slate-800 max-w-xl w-full text-white rounded-md p-2 my-5"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

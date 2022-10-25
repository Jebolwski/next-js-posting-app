import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { async } from "@firebase/util";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../utils/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post(params) {
  const [user, loading] = useAuthState(auth);
  const [post, setPost] = useState({ description: "" });
  const router = useRouter();
  const routeData = router?.query;
  const [descLength, setDescLength] = useState(
    routeData ? routeData.description?.length : 0
  );
  const createPost = async (e) => {
    e.preventDefault();

    //TODO Checking validation
    if (!post.description) {
      toast.error("Description field is required 😅", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (post.description.length > 300) {
      toast.error("Description field is too long 😅", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      return;
    }
    if (routeData.id) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      toast.success("Your post has been edited 👍", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      return router.push("/");
    } else {
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Your post has been created 👍", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      router.push("/");
    }
  };
  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push("/auth/login");
    }
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  }, [user, loading]);
  return (
    <div className="s shadow-md p-10 max-w-lg rounded-lg mx-auto">
      <form onSubmit={createPost}>
        <h1 className="text-xl font-bold">
          {routeData.id ? "Edit a post" : "Create a new post"}
        </h1>
        <div className="py-4">
          <h3>Description</h3>
          <textarea
            rows="10"
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
            }}
            defaultValue={routeData.description ? routeData.description : null}
            className="w-full bg-gray-800 p-2 text-white rounded-lg"
          ></textarea>

          <p
            className={`${post.description.length > 300 ? "text-red-500" : ""}`}
          >
            {post.description.length}/300
          </p>
          <button className="mt-4 bg-cyan-700 text-white p-1 rounded-md w-full">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

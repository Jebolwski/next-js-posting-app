import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Nav() {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className="flex items-center justify-between py-4">
      <Link href={"/"}>
        <button className="font-medium">Creative Ideas</button>
      </Link>
      {user ? (
        <div className="flex items-center gap-6">
          <Link href={"/post"}>
            <button className="font-medium bg-cyan-500 text-white px-3 py-1 rounded-sm">
              Post
            </button>
          </Link>
          <Link href={"/dashboard"}>
            <img
              className="w-10 rounded-full cursor-pointer"
              src={user.photoURL}
            ></img>
          </Link>
        </div>
      ) : null}
      {user ? null : (
        <Link href={"/auth/login"}>
          <a className="bg-cyan-400 p-3 text-white rounded-lg">Join Now</a>
        </Link>
      )}
    </nav>
  );
}

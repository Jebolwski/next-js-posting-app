import Link from "next/link";

export default function Comment(params) {
  return (
    <div className="shadow-md p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-3">
        <img src={params?.post.avatar} className="w-10 rounded-full" />
        <h2>{params?.post.username}</h2>
      </div>
      <div className="pt-4">
        <p>{params?.post?.message}</p>
      </div>
    </div>
  );
}

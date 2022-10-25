import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="mx-6 md:mx font-poppins">
      <Nav />
      <main>{children}</main>
    </div>
  );
}

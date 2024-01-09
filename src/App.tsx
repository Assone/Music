import { Link, Outlet } from "@tanstack/react-router";

const App: React.FC = () => (
  <main>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/search" className="[&.active]:font-bold">
        Search
      </Link>
    </div>
    <hr />

    <Outlet />
  </main>
);

export default App;

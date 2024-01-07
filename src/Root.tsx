/* eslint-disable import/no-extraneous-dependencies */
import { Link, Outlet } from "@tanstack/react-router";
import { DehydrateRouter } from "@tanstack/react-router-server/client";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

function Root() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <DehydrateRouter />
      <TanStackRouterDevtools />
    </>
  );
}

export default Root;

import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Portfolio } from "./components/Portfolio";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Charity } from "./components/Charity";
import { Contact } from "./components/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "portfolio", Component: Portfolio },
      { path: "services", Component: Services },
      { path: "about", Component: About },
      { path: "charity", Component: Charity },
      { path: "contact", Component: Contact },
    ],
  },
]);
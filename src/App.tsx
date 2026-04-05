import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  Home,
  CalendarDays,
  History,
  LineChart,
  BookOpen,
  Mail,
  Microscope,
  Menu,
  X,
} from "lucide-react";
import { Layout } from "./components/Layout";
import { Home as HomePage } from "./pages/Home";
import { Events } from "./pages/Events";
import { PastEvents } from "./pages/PastEvents";
import { Impact } from "./pages/Impact";
import { Resources } from "./pages/Resources";
import { Contact } from "./pages/Contact";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { RequireAdminAuth } from "./components/RequireAdminAuth";

const navItems = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/events", label: "Events", Icon: CalendarDays },
  { to: "/events/past", label: "Past events", Icon: History },
  { to: "/impact", label: "Impact", Icon: LineChart },
  { to: "/resources", label: "Resources", Icon: BookOpen },
  { to: "/contact", label: "Get involved", Icon: Mail },
] as const;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              navItems={navItems}
              logoImageSrc="/logo.svg"
              logoIcon={Microscope}
              menuIcon={Menu}
              closeIcon={X}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="events" element={<Events />} />
          <Route path="events/past" element={<PastEvents />} />
          <Route path="impact" element={<Impact />} />
          <Route path="resources" element={<Resources />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route
            path="admin"
            element={
              <RequireAdminAuth>
                <Admin />
              </RequireAdminAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

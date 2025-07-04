import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout"; // Contains the sidebar
import Dashboard from "./components/Dashboard";
import EmailTemplates from "./components/EmailTemplates";
import SendEmail from "./components/SendEmail";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for login page, without sidebar */}
        <Route path="/" element={<Login />} />

        {/* Routes that use sidebar */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/send-email" element={<SendEmail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

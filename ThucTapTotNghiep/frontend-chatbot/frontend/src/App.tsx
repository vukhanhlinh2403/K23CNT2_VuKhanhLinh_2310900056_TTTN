/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { ChatWidget } from "./components/common/ChatWidget";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ChatWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}


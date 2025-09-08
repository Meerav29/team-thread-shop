import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/auth/check", { credentials: "include" })
      .then(res => res.json())
      .then(data => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) return null;

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

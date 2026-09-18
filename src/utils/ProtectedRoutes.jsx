
import { Navigate, useLocation } from "react-router-dom";

export function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

// export function getUserRole(token) {
//   const decoded = decodeJWT(token);
//   return decoded ? decoded.role || null : null;
// }

export function getUsername(token) {
  const decoded = decodeJWT(token);
  return decoded ? decoded.sub || null : null;
}

export function getUserTopics(token) {
  const decoded = decodeJWT(token);
  if (!decoded) return [];
  const raw = decoded.topic;
  if (Array.isArray(raw)) return raw;
  // Backwards compat: if backend ever sends a single object
  if (raw && typeof raw === "object") return [raw];
  return [];
}

export function getUserPermissions(token) {
  const decoded = decodeJWT(token);
  return decoded ? decoded.accessPermissions || {} : {};
}


function resolveField(topics, key) {
  const values = topics
    .map((t) => t && t[key])
    .filter((v) => v != null && v !== "" && v !== "null");

  const unique = [...new Set(values)];

  if (unique.length === 0) {
    return { value: "", locked: false, options: [] };
  }
  if (unique.length === 1) {
    return { value: unique[0], locked: true, options: unique };
  }
  return { value: "", locked: false, options: unique };
}

export function getUserAccess() {
  const token = sessionStorage.getItem("token");
  const topics = getUserTopics(token);
  const decoded = token ? decodeJWT(token) : null;

  return {
    role: decoded?.role || "SUPERADMIN",
    state: resolveField(topics, "state"),
    zone: resolveField(topics, "zone"),
    circle: resolveField(topics, "circle"),
    division: resolveField(topics, "division"),
    area: resolveField(topics, "area"),
    topics,
  };
}

const pathToPermissionKey = {
  "/": "dashboard",
  "/livemonitoring": "livemonitoring",
  "/historical": "historical",
  "/alarms": "alarms",
  "/daywise": "daywise",
  "/monthly": "monthly",
  "/packetviewer": "packetviewer",
  "/issuetracking": "issuetracking",
  "/siteDetails": "siteDetails",
  "/users": "users",
};

export const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const currentPath = location.pathname;

  if (!token) {
    console.log("ProtectedRoute: No token found, redirecting to /login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const permissions = getUserPermissions(token);
 
  const currentKey = pathToPermissionKey[currentPath];

  // Check if the user has permission for the current path
  if (currentKey && permissions[currentKey]) {
    return children;
  }

  // If no permission for the current path, redirect to a fallback page
  console.log("ProtectedRoute: No permission for", currentPath, "redirecting to /unauthorized");
  return <Navigate to="/unauthorized" replace state={{ from: location }} />;
};
import { moduleRoutes } from "../../../routes";
import { CONFIG } from "../../core/config";

export const generateRouteHTML = () => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? `https://${CONFIG.CORE.ip ?? "your-production-domain.com"}`
      : `http://${CONFIG.CORE.ip ?? "localhost"}:${CONFIG.CORE.port ?? 5000}`;

  return `
    <div style="font-family: sans-serif; padding: 2rem; line-height: 1.7;">
     <h1 style="font-size: 2rem; margin-bottom: 1rem;">✈️ Bush Buddy Travel APP API Server</h1>
      <p>Available API Endpoints under <code>${baseURL}/api/v1</code>:</p>
      <ul style="padding-left: 1.2rem;">
        ${moduleRoutes
          .map(
            (route) => `
              <li style="margin: 0.0rem 0;">
                <a href="${baseURL}/api/v1${route.path}" target="_blank" style="color:rgb(0, 62, 128); text-decoration: none;">
                  ${baseURL}/api/v1${route.path}
                </a>
              </li>
            `
          )
          .join("")}
      </ul>
      <p style="margin-top: 1rem; color: gray;">Last Updated: ${new Date().toLocaleString()}</p>
    </div>
  `;
};

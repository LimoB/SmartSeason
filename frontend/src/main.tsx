import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Redux
import { Provider } from "react-redux";
import { store } from "./app/store";

// Toast
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Global Styles
import "./index.css";
//triger deploy
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />

      {/* ================= GLOBAL TOAST (PROD OPTIMIZED) ================= */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        limit={3}
        toastStyle={{
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
      />
    </Provider>
  </React.StrictMode>
);
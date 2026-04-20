import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Redux
import { Provider } from "react-redux";
import { store } from "./app/store";

// Toast
import { ToastContainer, Slide } from "react-toastify"; // Added Slide for animation
import "react-toastify/dist/ReactToastify.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />

      {/* ================= GLOBAL TOAST (COMPACT & ANIMATED) ================= */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}   // Removed the progress "count line"
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}       // Modern slide animation
        limit={3}
        toastStyle={{
          borderRadius: "8px",
          fontSize: "12.5px",    // Reduced size
          fontWeight: 600,
          minHeight: "45px",     // Smaller vertical footprint
          padding: "6px 10px",   // Tighter padding
          maxWidth: "200px",     // Reduced width
        }}
      />
    </Provider>
  </React.StrictMode>
);
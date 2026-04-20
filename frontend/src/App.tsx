import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router";
import { Provider } from "react-redux";
import { store } from "./app/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-white">
          {/* App Routes */}
          <AppRouter />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
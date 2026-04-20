import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppWrapper from "./AppWrapper";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper>
          <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
            {/* App Routes */}
            <AppRouter />
          </div>
        </AppWrapper>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
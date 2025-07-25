import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from "./App.tsx";
import {Provider} from "react-redux";
import {store} from "./store";
import {NotificationProvider, ThemeProvider} from "./contexts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <NotificationProvider>
              <ThemeProvider>
                  <App />
              </ThemeProvider>
          </NotificationProvider>
      </Provider>
  </StrictMode>,
)



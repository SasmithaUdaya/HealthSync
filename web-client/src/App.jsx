
import AppRouting from "./config/AppRouting.jsx";
import {AuthProvider} from "./contexts/auth-context..jsx";
import {BrowserRouter} from "react-router-dom";


function App() {

  return (
      <BrowserRouter>
        <AuthProvider>
            <AppRouting/>
        </AuthProvider>
      </BrowserRouter>
  )
}

export default App

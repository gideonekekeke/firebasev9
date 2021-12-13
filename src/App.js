import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderView from "./Components/HeaderView";
import HomeScreen from "./Components/HomeScreen";
import RegistrationPage from "./Components/RegistrationPage";

function App() {
	return (
		<div>
			<Router>
				<HeaderView />
				<Routes>
					<Route path='/' element={<HomeScreen />} />
					<Route path='/register' element={<RegistrationPage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;

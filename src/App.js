import { Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";

import Cart from "./pages/Cart";
import Mainpage from "./pages/Mainpage";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/main" component={Mainpage} />
      <Route path="/product/:productId" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
    </div>
  );
}

export default App;

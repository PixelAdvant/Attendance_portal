// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import ManagerLayout from "./components/ManagerLayout";
// import { getLoggedInManager } from "./utils/storage";

// function App() {
//   const manager = getLoggedInManager();

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/portal/*"
//           element={manager ? <ManagerLayout /> : <Navigate to="/" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// import React from "react";
// import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import ManagerLayout from "./components/ManagerLayout";
// import { getLoggedInManager } from "./utils/storage";

// function App() {
//   const manager = getLoggedInManager();

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/portal/*"
//           element={manager ? <ManagerLayout /> : <Navigate to="/" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ManagerLayout from "./components/ManagerLayout";
import { getLoggedInManager } from "./utils/storage";

function App() {
  const manager = getLoggedInManager();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/portal/*"
        element={manager ? <ManagerLayout /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;

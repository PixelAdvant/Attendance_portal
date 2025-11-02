// import React from "react";
// import { Form, Input, Button, Card, message } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import { getManagers, setLoggedInManager } from "../utils/storage";

// const Login = () => {
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     const managers = getManagers();
//     const email = values.email.trim().toLowerCase();
//     const password = values.password.trim();

//     const manager = managers.find(
//       (m) => m.email.trim().toLowerCase() === email && m.password === password
//     );

//     if (manager) {
//       setLoggedInManager(manager);
//       message.success("Login successful!");
//       navigate("/portal/labours");
//     } else {
//       console.log("Stored managers:", managers); // Debug
//       message.error("Invalid credentials! Please sign up first.");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Card title="Login" style={{ width: 350 }}>
//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[{ required: true, type: "email" }]}
//           >
//             <Input placeholder="Enter your email" />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[{ required: true }]}
//           >
//             <Input.Password placeholder="Enter your password" />
//           </Form.Item>

//           <Button type="primary" htmlType="submit" block>
//             Login
//           </Button>
//         </Form>

//         <p style={{ marginTop: 10 }}>
//           Don’t have an account? <Link to="/signup">Sign up</Link>
//         </p>
//       </Card>
//     </div>
//   );
// };

// export default Login;
// import React, { useState, useEffect } from "react";
// import { Form, Input, Button, Card, message } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import { getManagers, getLoggedInManager, setLoggedInManager } from "../utils/storage";

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // 🧹 Optional: Clear old session when visiting login page
//   useEffect(() => {
//     // Remove this line if you want persistent login
//     localStorage.removeItem("loggedInManager");
//   }, []);

//   const onFinish = (values) => {
//     setLoading(true);

//     const managers = getManagers();
//     const email = values.email.trim().toLowerCase();
//     const password = values.password.trim();

//     const manager = managers.find(
//       (m) => m.email.trim().toLowerCase() === email && m.password === password
//     );

//     setTimeout(() => {
//       if (manager) {
//         setLoggedInManager(manager);
//         message.success(`Welcome back, ${manager.name || "Manager"}!`);
//         navigate("/portal/labours");
//       } else {
//         message.error("Invalid email or password. Please sign up first.");
//       }
//       setLoading(false);
//     }, 800); // simulate small delay
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#f0f2f5",
//       }}
//     >
//       <Card
//         title="Manager Login"
//         style={{
//           width: 360,
//           borderRadius: 10,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
//           >
//             <Input placeholder="Enter your email" />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[{ required: true, message: "Enter your password" }]}
//           >
//             <Input.Password placeholder="Enter your password" />
//           </Form.Item>

//           <Button type="primary" htmlType="submit" block loading={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </Button>
//         </Form>

//         <p style={{ marginTop: 10, textAlign: "center" }}>
//           Don’t have an account? <Link to="/signup">Sign up</Link>
//         </p>
//       </Card>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  getManagers,
  getLoggedInManager,
  setLoggedInManager,
} from "../utils/storage";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const loggedIn = getLoggedInManager();
    if (loggedIn) {
      navigate("/portal/labours", { replace: true });
    }
  }, [navigate]);

  const onFinish = (values) => {
    setLoading(true);

    const managers = getManagers();
    const email = values.email.trim().toLowerCase();
    const password = values.password.trim();

    const manager = managers.find(
      (m) => m.email.trim().toLowerCase() === email && m.password === password
    );

    setTimeout(() => {
      if (manager) {
        setLoggedInManager(manager);
        message.success(`Welcome back, ${manager.name || "Manager"}!`);
        // ✅ Works with HashRouter on GitHub Pages
        navigate("/portal/labours", { replace: true });
      } else {
        message.error("Invalid email or password. Please sign up first.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        title="Manager Login"
        style={{
          width: 360,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <p style={{ marginTop: 10, textAlign: "center" }}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;

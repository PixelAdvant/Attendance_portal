// import React, { useState } from "react";
// import { Form, Input, Button, Card, message } from "antd";
// import { useNavigate, Link } from "react-router-dom";
// import { getManagers, addManager } from "../utils/storage";

// const Signup = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     setLoading(true);

//     const managers = getManagers();
//     const email = values.email.trim().toLowerCase();

//     // check for duplicate emails
//     if (managers.find((m) => m.email.trim().toLowerCase() === email)) {
//       message.error("Manager with this email already exists!");
//       setLoading(false);
//       return;
//     }

//     // create new manager record
//     const newManager = {
//       name: values.name.trim(),
//       email: email,
//       password: values.password.trim(),
//       role: "manager",
//       permissions: [],
//     };

//     addManager(newManager);

//     console.log("✅ New Manager Added:", newManager); // Debug

//     message.success("Signup successful! Please login now.");
//     setLoading(false);
//     navigate("/");
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
//       <Card title="Manager Signup" style={{ width: 350 }}>
//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             name="name"
//             label="Full Name"
//             rules={[{ required: true, message: "Please enter your name" }]}
//           >
//             <Input placeholder="Enter your name" />
//           </Form.Item>

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
//             rules={[{ required: true, min: 4, message: "Minimum 4 characters" }]}
//           >
//             <Input.Password placeholder="Enter password" />
//           </Form.Item>

//           <Button type="primary" htmlType="submit" block loading={loading}>
//             Sign Up
//           </Button>
//         </Form>

//         <p style={{ marginTop: 10 }}>
//           Already have an account? <Link to="/">Login</Link>
//         </p>
//       </Card>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { getManagers, addManager } from "../utils/storage";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    const managers = getManagers();
    const email = values.email.trim().toLowerCase();

    // ✅ Check for duplicate manager email
    if (managers.find((m) => m.email.trim().toLowerCase() === email)) {
      message.error("A manager with this email already exists!");
      setLoading(false);
      return;
    }

    // ✅ Create a new manager record
    const newManager = {
      id: Date.now(),
      name: values.name.trim(),
      email: email,
      password: values.password.trim(),
      role: "manager",
      permissions: [],
    };

    addManager(newManager);

    message.success("Signup successful! Please login now.");
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
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
        title="Manager Signup"
        style={{
          width: 360,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, min: 4, message: "Password must be at least 4 characters" },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </Form>

        <p style={{ marginTop: 10, textAlign: "center" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;

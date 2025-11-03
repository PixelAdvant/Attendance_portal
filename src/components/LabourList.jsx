// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, Form, Input, message, Card } from "antd";
// import {
//   getLoggedInManager,
//   getLabours,
//   addLabour,
//   saveLabours,
// } from "../utils/storage";

// const LabourList = () => {
//   const [manager, setManager] = useState(null);
//   const [labours, setLabours] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const loggedIn = getLoggedInManager();
//     if (!loggedIn) {
//       message.error("No manager logged in!");
//       return;
//     }
//     setManager(loggedIn);
//     setLabours(getLabours(loggedIn.email) || []);
//   }, []);

//   const handleAddLabour = (values) => {
//     if (!manager) return;
//     addLabour(manager.email, values);
//     setLabours(getLabours(manager.email));
//     message.success("Labour added successfully!");
//     form.resetFields();
//     setIsModalVisible(false);
//   };

//   const handleDelete = (id) => {
//     const updated = labours.filter((l) => l.id !== id);
//     saveLabours(manager.email, updated);
//     setLabours(updated);
//     message.success("Labour deleted!");
//   };

//   const columns = [
//     { title: "Name", dataIndex: "name" },
//     { title: "Work Type", dataIndex: "workType" },
//     {
//       title: "Action",
//       render: (_, record) => (
//         <Button danger onClick={() => handleDelete(record.id)}>
//           Delete
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <Card
//         title="Labour Management"
//         extra={
//           <Button type="primary" onClick={() => setIsModalVisible(true)}>
//             + Add Labour
//           </Button>
//         }
//       >
//         <Table
//           dataSource={labours}
//           columns={columns}
//           rowKey="id"
//           pagination={false}
//         />
//       </Card>

//       <Modal
//         title="Add New Labour"
//         open={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <Form layout="vertical" form={form} onFinish={handleAddLabour}>
//           <Form.Item
//             name="name"
//             label="Labour Name"
//             rules={[{ required: true, message: "Please enter labour name" }]}
//           >
//             <Input placeholder="Enter labour name" />
//           </Form.Item>
//           <Form.Item
//             name="workType"
//             label="Work Type"
//             rules={[{ required: true, message: "Please enter work type" }]}
//           >
//             <Input placeholder="Enter work type (e.g., Mason, Painter)" />
//           </Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Add Labour
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default LabourList;

// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal, Form, Input, message, Card } from "antd";
// import {
//   getLoggedInManager,
//   getLabours,
//   addLabour,
//   saveLabours,
// } from "../utils/storage";

// const LabourList = () => {
//   const [manager, setManager] = useState(null);
//   const [labours, setLabours] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const loggedIn = getLoggedInManager();
//     if (!loggedIn) {
//       message.error("No manager logged in!");
//       return;
//     }
//     setManager(loggedIn);
//     setLabours(getLabours(loggedIn.email) || []);
//   }, []);

//   const handleAddLabour = (values) => {
//     if (!manager) return;
//     addLabour(manager.email, values);
//     setLabours(getLabours(manager.email));
//     message.success("Labour added successfully!");
//     form.resetFields();
//     setIsModalVisible(false);
//   };

//   const handleDelete = (id) => {
//     const updated = labours.filter((l) => l.id !== id);
//     saveLabours(manager.email, updated);
//     setLabours(updated);
//     message.success("Labour deleted!");
//   };


//   const columns = [
//     {
//       title: "S.No",
//       render: (_, __, index) => index + 1,
//       width: 80,
//     },
//     { title: "Name", dataIndex: "name" },
//     { title: "Work Type", dataIndex: "workType" },
//     {
//       title: "Action",
//       render: (_, record) => (
//         <Button danger onClick={() => handleDelete(record.id)}>
//           Delete
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <Card
//         title="Labour Management"
//         extra={
//           <Button
//             type="primary"
//             onClick={() => setIsModalVisible(true)}
//           >
//             + Add Labour
//           </Button>
//         }
//       >
//         <Table
//           dataSource={labours}
//           columns={columns}
//           rowKey="id"
//           pagination={false}
//         />
//       </Card>

//       <Modal
//         title="Add New Labour"
//         open={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <Form layout="vertical" form={form} onFinish={handleAddLabour}>
//           <Form.Item
//             name="name"
//             label="Labour Name"
//             rules={[{ required: true, message: "Please enter labour name" }]}
//           >
//             <Input placeholder="Enter labour name" />
//           </Form.Item>
//           <Form.Item
//             name="workType"
//             label="Work Type"
//             rules={[{ required: true, message: "Please enter work type" }]}
//           >
//             <Input placeholder="Enter work type (e.g., Mason, Painter)" />
//           </Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Add Labour
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default LabourList;
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Card,
  Typography,
} from "antd";
import { DownloadOutlined, FilePdfOutlined, PlusOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getLoggedInManager,
  getLabours,
  addLabour,
  saveLabours,
} from "../utils/storage";

const { Option } = Select;
const { Text } = Typography;

const LabourList = () => {
  const [manager, setManager] = useState(null);
  const [labours, setLabours] = useState([]);
  const [filteredLabours, setFilteredLabours] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const skillOptions = [
    "Mason",
    "Carpenter",
    "Electrician",
    "Painter",
    "Plumber",
    "Welder",
    "Helper",
  ];

  useEffect(() => {
    const loggedIn = getLoggedInManager();
    if (!loggedIn) {
      message.error("No manager logged in!");
      return;
    }
    setManager(loggedIn);
    const labourList = getLabours(loggedIn.email) || [];
    setLabours(labourList);
    setFilteredLabours(labourList);
  }, []);

  // 🔍 Search Functionality
  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredLabours(
      labours.filter(
        (l) =>
          `${l.firstName} ${l.lastName}`.toLowerCase().includes(lower) ||
          l.workType.toLowerCase().includes(lower)
      )
    );
  }, [search, labours]);

  // ➕ Add Labour
  const handleAddLabour = (values) => {
    if (!manager) return;

    const newLabour = {
      ...values,
      name: `${values.firstName} ${values.lastName}`,
      id: Date.now(),
      empId: "EMP" + Date.now().toString().slice(-4),
    };

    addLabour(manager.email, newLabour);
    const updated = getLabours(manager.email);
    setLabours(updated);
    setFilteredLabours(updated);

    message.success("Labour added successfully!");
    form.resetFields();
    setIsModalVisible(false);
  };

  // ❌ Delete Labour
  const handleDelete = (id) => {
    const updated = labours.filter((l) => l.id !== id);
    saveLabours(manager.email, updated);
    setLabours(updated);
    setFilteredLabours(updated);
    message.success("Labour deleted!");
  };

  // 📤 Export to Excel
  const exportToExcel = () => {
    const data = filteredLabours.map((l, index) => ({
      "S.No": index + 1,
      "Emp ID": l.empId,
      "First Name": l.firstName,
      "Last Name": l.lastName,
      "Skill/Trade": l.workType,
      "Supervisor": l.supervisor,
      "Contact No": l.contact,
      "Daily Wage (₹)": l.dailyWage,
      "Overtime Rate (₹/hr)": l.overtimeRate,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Labours");
    XLSX.writeFile(wb, "LabourList.xlsx");
  };

  // 📄 Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Labour List", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "S.No",
          "Emp ID",
          "First Name",
          "Last Name",
          "Skill/Trade",
          "Supervisor",
          "Contact No",
          "Daily Wage (₹)",
          "Overtime Rate (₹/hr)",
        ],
      ],
      body: filteredLabours.map((l, index) => [
        index + 1,
        l.empId,
        l.firstName,
        l.lastName,
        l.workType,
        l.supervisor,
        l.contact,
        l.dailyWage,
        l.overtimeRate,
      ]),
    });
    doc.save("LabourList.pdf");
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    { title: "Emp ID", dataIndex: "empId", width: 120 },
    {
      title: "Full Name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: "Skill / Trade", dataIndex: "workType" },
    { title: "Supervisor", dataIndex: "supervisor" },
    { title: "Contact No", dataIndex: "contact" },
    { title: "Daily Wage (₹)", dataIndex: "dailyWage" },
    { title: "Overtime Rate (₹/hr)", dataIndex: "overtimeRate" },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={
          <>
            Labour Management{" "}
            <Text type="secondary" style={{ marginLeft: 10 }}>
              👷 Total: {filteredLabours.length} Labour
              {filteredLabours.length !== 1 ? "s" : ""}
            </Text>
          </>
        }
        extra={
          <>
            <Input
              placeholder="Search by name or trade"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 220, marginRight: 10 }}
            />
            <Button
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              style={{ marginRight: 10 }}
            >
              Excel
            </Button>
            <Button
              icon={<FilePdfOutlined />}
              onClick={exportToPDF}
              style={{ marginRight: 10 }}
            >
              PDF
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              + Add Labour
            </Button>
          </>
        }
      >
        <Table
          dataSource={filteredLabours}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* ➕ Add Labour Modal */}
      <Modal
        title="Add New Labour"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAddLabour}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            name="workType"
            label="Skill / Trade"
            rules={[{ required: true, message: "Please select or type trade" }]}
          >
            <Select
              showSearch
              mode="combobox"
              placeholder="Select or type skill (e.g., Mason, Painter)"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {skillOptions.map((skill) => (
                <Option key={skill} value={skill}>
                  {skill}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="supervisor"
            label="Supervisor"
            rules={[{ required: true, message: "Please enter supervisor name" }]}
          >
            <Input placeholder="Enter supervisor name" />
          </Form.Item>

          <Form.Item
            name="contact"
            label="Contact Number"
            rules={[
              { required: true, message: "Please enter contact number" },
              { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
            ]}
          >
            <Input placeholder="Enter phone number" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="dailyWage"
            label="Daily Wage (₹)"
            rules={[{ required: true, message: "Please enter daily wage" }]}
          >
            <InputNumber
              placeholder="e.g., 500"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="overtimeRate"
            label="Overtime Rate (₹ per hour)"
            rules={[{ required: true, message: "Please enter overtime rate" }]}
          >
            <InputNumber
              placeholder="e.g., 75"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Labour
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default LabourList;

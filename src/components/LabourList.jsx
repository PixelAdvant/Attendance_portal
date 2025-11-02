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

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Card } from "antd";
import {
  getLoggedInManager,
  getLabours,
  addLabour,
  saveLabours,
} from "../utils/storage";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const LabourList = () => {
  const [manager, setManager] = useState(null);
  const [labours, setLabours] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loggedIn = getLoggedInManager();
    if (!loggedIn) {
      message.error("No manager logged in!");
      return;
    }
    setManager(loggedIn);
    setLabours(getLabours(loggedIn.email) || []);
  }, []);

  const handleAddLabour = (values) => {
    if (!manager) return;
    addLabour(manager.email, values);
    setLabours(getLabours(manager.email));
    message.success("Labour added successfully!");
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    const updated = labours.filter((l) => l.id !== id);
    saveLabours(manager.email, updated);
    setLabours(updated);
    message.success("Labour deleted!");
  };

  // 🧾 Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      labours.map((l, i) => ({
        "S.No": i + 1,
        Name: l.name,
        "Work Type": l.workType,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Labours");
    XLSX.writeFile(workbook, "Labour_List.xlsx");
  };

  // 🧾 Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Labour List", 14, 10);
    doc.autoTable({
      head: [["S.No", "Name", "Work Type"]],
      body: labours.map((l, i) => [i + 1, l.name, l.workType]),
      startY: 20,
    });
    doc.save("Labour_List.pdf");
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Work Type", dataIndex: "workType" },
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
        title="Labour Management"
        extra={
          <>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => setIsModalVisible(true)}
            >
              + Add Labour
            </Button>
            <Button onClick={exportToExcel} style={{ marginRight: 8 }}>
              Export Excel
            </Button>
            <Button onClick={exportToPDF} type="dashed">
              Export PDF
            </Button>
          </>
        }
      >
        <Table
          dataSource={labours}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title="Add New Labour"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAddLabour}>
          <Form.Item
            name="name"
            label="Labour Name"
            rules={[{ required: true, message: "Please enter labour name" }]}
          >
            <Input placeholder="Enter labour name" />
          </Form.Item>
          <Form.Item
            name="workType"
            label="Work Type"
            rules={[{ required: true, message: "Please enter work type" }]}
          >
            <Input placeholder="Enter work type (e.g., Mason, Painter)" />
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

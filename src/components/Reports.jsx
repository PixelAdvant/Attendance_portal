// import React, { useEffect, useState } from "react";
// import { Table, Card, message } from "antd";
// import { getLoggedInManager, getAttendance } from "../utils/storage";

// const Reports = () => {
//   const [manager, setManager] = useState(null);
//   const [attendance, setAttendance] = useState([]);

//   useEffect(() => {
//     const loggedIn = getLoggedInManager();
//     if (!loggedIn) {
//       message.error("No manager logged in!");
//       return;
//     }
//     setManager(loggedIn);
//     setAttendance(getAttendance(loggedIn.email) || []);
//   }, []);

//   const calculateHours = (inTime, outTime) => {
//     if (!inTime || !outTime) return "-";
//     try {
//       const start = new Date(`2024-01-01 ${inTime}`);
//       const end = new Date(`2024-01-01 ${outTime}`);
//       const diff = end - start;
//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const mins = Math.floor((diff / (1000 * 60)) % 60);
//       return `${hours}h ${mins}m`;
//     } catch {
//       return "-";
//     }
//   };

//   const columns = [
//     { title: "Date", dataIndex: "date" },
//     { title: "Labour Name", dataIndex: "labourName" },
//     { title: "Work Type", dataIndex: "workType" },
//     { title: "Clock In", dataIndex: "clockIn" },
//     { title: "Clock Out", dataIndex: "clockOut" },
//     {
//       title: "Work Duration",
//       render: (record) => calculateHours(record.clockIn, record.clockOut),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <Card title="Daily Attendance Report">
//         <Table
//           columns={columns}
//           dataSource={attendance}
//           rowKey="id"
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default Reports;
import React, { useEffect, useState } from "react";
import { Table, Button, Card, message, Popconfirm } from "antd";
import {
  getLoggedInManager,
  getAttendance,
  saveAttendance,
  getLabours,
} from "../utils/storage";

const Reports = () => {
  const [manager, setManager] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const loggedIn = getLoggedInManager();
    if (!loggedIn) {
      message.error("No manager logged in!");
      return;
    }

    setManager(loggedIn);

    // Clean attendance of deleted labours
    const labours = getLabours(loggedIn.email) || [];
    const allAttendance = getAttendance(loggedIn.email) || [];
    const filtered = allAttendance.filter((a) =>
      labours.some((l) => l.id === a.labourId)
    );

    if (filtered.length !== allAttendance.length) {
      saveAttendance(loggedIn.email, filtered);
    }

    setAttendance(filtered);
  }, []);

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "-";
    try {
      const start = new Date(`2024-01-01 ${inTime}`);
      const end = new Date(`2024-01-01 ${outTime}`);
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      return `${hours}h ${mins}m`;
    } catch {
      return "-";
    }
  };

  const handleDelete = (recordId) => {
    if (!manager) return;

    const updated = attendance.filter((a) => a.id !== recordId);
    saveAttendance(manager.email, updated);
    setAttendance(updated);
    message.success("Attendance record deleted successfully!");
  };

  const columns = [
    { title: "Date", dataIndex: "date" },
    { title: "Labour Name", dataIndex: "labourName" },
    { title: "Work Type", dataIndex: "workType" },
    { title: "Clock In", dataIndex: "clockIn" },
    { title: "Clock Out", dataIndex: "clockOut" },
    {
      title: "Work Duration",
      render: (record) => calculateHours(record.clockIn, record.clockOut),
    },
    {
      title: "Action",
      render: (record) => (
        <Popconfirm
          title="Are you sure you want to delete this record?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Daily Attendance Report">
        <Table
          columns={columns}
          dataSource={attendance}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Reports;

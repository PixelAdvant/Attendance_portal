// import React, { useEffect, useState } from "react";
// import { Table, Button, Card, message, Popconfirm } from "antd";
// import {
//   getLoggedInManager,
//   getAttendance,
//   saveAttendance,
//   getLabours,
// } from "../utils/storage";

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

//     // Clean attendance of deleted labours
//     const labours = getLabours(loggedIn.email) || [];
//     const allAttendance = getAttendance(loggedIn.email) || [];
//     const filtered = allAttendance.filter((a) =>
//       labours.some((l) => l.id === a.labourId)
//     );

//     if (filtered.length !== allAttendance.length) {
//       saveAttendance(loggedIn.email, filtered);
//     }

//     setAttendance(filtered);
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

//   const handleDelete = (recordId) => {
//     if (!manager) return;

//     const updated = attendance.filter((a) => a.id !== recordId);
//     saveAttendance(manager.email, updated);
//     setAttendance(updated);
//     message.success("Attendance record deleted successfully!");
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
//     {
//       title: "Action",
//       render: (record) => (
//         <Popconfirm
//           title="Are you sure you want to delete this record?"
//           onConfirm={() => handleDelete(record.id)}
//           okText="Yes"
//           cancelText="No"
//         >
//           <Button danger>Delete</Button>
//         </Popconfirm>
//       ),
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
import { Table, Button, Card, DatePicker, Select, Row, Col, message, Popconfirm } from "antd";
import { FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import {
  getLoggedInManager,
  getAttendance,
  saveAttendance,
  getLabours,
} from "../utils/storage";

const { RangePicker } = DatePicker;

const Reports = () => {
  const [manager, setManager] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDay, setFilterDay] = useState("");
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    const loggedIn = getLoggedInManager();
    if (!loggedIn) {
      message.error("No manager logged in!");
      return;
    }

    setManager(loggedIn);

    const labours = getLabours(loggedIn.email) || [];
    const allAttendance = getAttendance(loggedIn.email) || [];

    const valid = allAttendance.filter((a) =>
      labours.some((l) => l.id === a.labourId)
    );

    if (valid.length !== allAttendance.length) {
      saveAttendance(loggedIn.email, valid);
    }

    setAttendance(valid);
    setFilteredData(valid);
  }, []);

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    try {
      const start = new Date(`2024-01-01 ${inTime}`);
      const end = new Date(`2024-01-01 ${outTime}`);
      return (end - start) / (1000 * 60 * 60);
    } catch {
      return 0;
    }
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const totalHours = filteredData.reduce(
    (sum, record) => sum + calculateHours(record.clockIn, record.clockOut),
    0
  );

  const handleFilter = () => {
    let filtered = [...attendance];

    if (dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter((item) =>
        dayjs(item.date).isBetween(start, end, "day", "[]")
      );
    }

    if (filterDay) {
      filtered = filtered.filter(
        (item) =>
          dayjs(item.date).format("dddd").toLowerCase() === filterDay.toLowerCase()
      );
    }

    setFilteredData(filtered);
  };

  const handleDelete = (id) => {
    const updated = attendance.filter((a) => a.id !== id);
    saveAttendance(manager.email, updated);
    setAttendance(updated);
    setFilteredData(updated);
    message.success("Deleted successfully!");
  };

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Attendance");
    XLSX.writeFile(wb, "Attendance_Report.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Attendance Report", 14, 15);

    const tableData = filteredData.map((item, index) => [
      index + 1,
      item.date,
      item.labourName,
      item.workType,
      item.clockIn,
      item.clockOut,
      formatDuration(calculateHours(item.clockIn, item.clockOut)),
    ]);

    autoTable(doc, {
      head: [["S.No", "Date", "Labour Name", "Work Type", "Clock In", "Clock Out", "Duration"]],
      body: tableData,
      startY: 25,
    });

    doc.text(`Total Work Hours: ${formatDuration(totalHours)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("Attendance_Report.pdf");
  };

  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1 },
    { title: "Date", dataIndex: "date" },
    { title: "Labour Name", dataIndex: "labourName" },
    { title: "Work Type", dataIndex: "workType" },
    { title: "Clock In", dataIndex: "clockIn" },
    { title: "Clock Out", dataIndex: "clockOut" },
    {
      title: "Work Duration",
      render: (record) =>
        formatDuration(calculateHours(record.clockIn, record.clockOut)),
    },
    {
      title: "Action",
      render: (record) => (
        <Popconfirm
          title="Delete this record?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Daily Attendance Report"
        extra={
          <div style={{ display: "flex", gap: 10 }}>
            <Button icon={<FileExcelOutlined />} onClick={exportExcel}>
              Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={exportPDF}>
              PDF
            </Button>
          </div>
        }
      >
        <Row gutter={[10, 10]} style={{ marginBottom: 10 }}>
          <Col span={10}>
            <RangePicker onChange={(values) => setDateRange(values)} />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filter by Day"
              style={{ width: "100%" }}
              onChange={setFilterDay}
              allowClear
            >
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                (day) => (
                  <Select.Option key={day} value={day}>
                    {day}
                  </Select.Option>
                )
              )}
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleFilter}>
              Apply Filter
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <div style={{ textAlign: "right", marginTop: 10, fontWeight: "bold" }}>
          Total Work Hours: {formatDuration(totalHours)}
        </div>
      </Card>
    </div>
  );
};

export default Reports;

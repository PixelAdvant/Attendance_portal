// import React, { useEffect, useState } from "react";
// import { Table, Button, Card, DatePicker, message, Popconfirm, Tabs, Progress, Space, Tag } from "antd";
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// import {
//   getLoggedInManager,
//   getAttendance,
//   saveAttendance,
//   getLabours,
// } from "../utils/storage";

// // Extend dayjs with isBetween plugin for date range filtering
// dayjs.extend(isBetween);

// const Reports = () => {
//   const [manager, setManager] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(dayjs());

//   useEffect(() => {
//     const loggedIn = getLoggedInManager();
//     if (!loggedIn) {
//       message.error("No manager logged in!");
//       return;
//     }

//     setManager(loggedIn);

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

//   // Calculate hours from clock in/out times
//   const calculateHours = (inTime, outTime) => {
//     if (!inTime || !outTime) return null;
//     try {
//       const start = new Date(`2024-01-01 ${inTime}`);
//       const end = new Date(`2024-01-01 ${outTime}`);
//       const diff = end - start;
//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const mins = Math.floor((diff / (1000 * 60)) % 60);
//       return { hours, mins, totalHours: diff / (1000 * 60 * 60) };
//     } catch {
//       return null;
//     }
//   };

//   const formatDuration = (inTime, outTime) => {
//     const duration = calculateHours(inTime, outTime);
//     if (!duration) return "-";
//     return `${duration.hours}h ${duration.mins}m`;
//   };

//   const calculatePercentage = (inTime, outTime, standardHours = 8) => {
//     const duration = calculateHours(inTime, outTime);
//     if (!duration) return 0;
//     return Math.min(Math.round((duration.totalHours / standardHours) * 100), 100);
//   };

//   const handleDelete = (recordId) => {
//     if (!manager) return;
//     const updated = attendance.filter((a) => a.id !== recordId);
//     saveAttendance(manager.email, updated);
//     setAttendance(updated);
//     message.success("Attendance record deleted successfully!");
//   };

//   // DAILY REPORT - Show attendance with hours percentage per employee
//   const getDailyReport = () => {
//     const dateStr = selectedDate.format('YYYY-MM-DD');
//     return attendance
//       .filter(a => a.date === dateStr && a.clockOut)
//       .map(record => ({
//         ...record,
//         percentage: calculatePercentage(record.clockIn, record.clockOut),
//         duration: formatDuration(record.clockIn, record.clockOut)
//       }));
//   };

//   const dailyColumns = [
//     { title: "Labour Name", dataIndex: "labourName", width: 150 },
//     { title: "Work Type", dataIndex: "workType", width: 120 },
//     { title: "Clock In", dataIndex: "clockIn", width: 100 },
//     { title: "Clock Out", dataIndex: "clockOut", width: 100 },
//     { title: "Duration", dataIndex: "duration", width: 100 },
//     {
//       title: "Hours Worked (Based on 8hr day)",
//       dataIndex: "percentage",
//       width: 250,
//       render: (percentage) => (
//         <Space>
//           <Progress
//             percent={percentage}
//             size="small"
//             style={{ width: 150 }}
//             status={percentage >= 100 ? 'success' : percentage >= 75 ? 'normal' : 'exception'}
//           />
//         </Space>
//       ),
//     },
//     {
//       title: "Action",
//       width: 100,
//       render: (record) => (
//         <Popconfirm
//           title="Delete this record?"
//           onConfirm={() => handleDelete(record.id)}
//           okText="Yes"
//           cancelText="No"
//         >
//           <Button danger size="small">Delete</Button>
//         </Popconfirm>
//       ),
//     },
//   ];

//   // WEEKLY REPORT - Group by employee and show days attended with progress bar
//   const getWeeklyReport = () => {
//     const startOfWeek = selectedDate.startOf('week');
//     const endOfWeek = selectedDate.endOf('week');

//     const weekAttendance = attendance.filter(a => {
//       const attDate = dayjs(a.date);
//       return attDate.isBetween(startOfWeek, endOfWeek, 'day', '[]') && a.clockOut;
//     });

//     // Group by labour
//     const labourMap = {};
//     weekAttendance.forEach(record => {
//       if (!labourMap[record.labourId]) {
//         labourMap[record.labourId] = {
//           labourId: record.labourId,
//           labourName: record.labourName,
//           workType: record.workType,
//           dates: new Set()
//         };
//       }
//       labourMap[record.labourId].dates.add(record.date);
//     });

//     return Object.values(labourMap).map(labour => ({
//       ...labour,
//       daysAttended: labour.dates.size,
//       totalDays: 7,
//       percentage: Math.round((labour.dates.size / 7) * 100)
//     }));
//   };

//   const weeklyColumns = [
//     { title: "Labour Name", dataIndex: "labourName", width: 150 },
//     { title: "Work Type", dataIndex: "workType", width: 120 },
//     {
//       title: "Days Attended",
//       dataIndex: "daysAttended",
//       width: 120,
//       render: (days, record) => (
//         <Tag color={days >= 5 ? 'green' : days >= 3 ? 'orange' : 'red'}>
//           {days} / {record.totalDays} days
//         </Tag>
//       )
//     },
//     {
//       title: "Attendance Rate",
//       dataIndex: "percentage",
//       width: 300,
//       render: (percentage) => (
//         <Space direction="vertical" style={{ width: '100%' }}>
//           <Progress
//             percent={percentage}
//             size="small"
//             status={percentage >= 70 ? 'success' : percentage >= 40 ? 'normal' : 'exception'}
//           />
//         </Space>
//       ),
//     },
//   ];

//   // MONTHLY REPORT - Group by employee and show days attended with progress bar
//   const getMonthlyReport = () => {
//     const startOfMonth = selectedDate.startOf('month');
//     const endOfMonth = selectedDate.endOf('month');
//     const daysInMonth = selectedDate.daysInMonth();

//     const monthAttendance = attendance.filter(a => {
//       const attDate = dayjs(a.date);
//       return attDate.isBetween(startOfMonth, endOfMonth, 'day', '[]') && a.clockOut;
//     });

//     // Group by labour
//     const labourMap = {};
//     monthAttendance.forEach(record => {
//       if (!labourMap[record.labourId]) {
//         labourMap[record.labourId] = {
//           labourId: record.labourId,
//           labourName: record.labourName,
//           workType: record.workType,
//           dates: new Set()
//         };
//       }
//       labourMap[record.labourId].dates.add(record.date);
//     });

//     return Object.values(labourMap).map(labour => ({
//       ...labour,
//       daysAttended: labour.dates.size,
//       totalDays: daysInMonth,
//       percentage: Math.round((labour.dates.size / daysInMonth) * 100)
//     }));
//   };

//   const monthlyColumns = [
//     { title: "Labour Name", dataIndex: "labourName", width: 150 },
//     { title: "Work Type", dataIndex: "workType", width: 120 },
//     {
//       title: "Days Attended",
//       dataIndex: "daysAttended",
//       width: 120,
//       render: (days, record) => (
//         <Tag color={days >= 20 ? 'green' : days >= 10 ? 'orange' : 'red'}>
//           {days} / {record.totalDays} days
//         </Tag>
//       )
//     },
//     {
//       title: "Attendance Rate",
//       dataIndex: "percentage",
//       width: 300,
//       render: (percentage) => (
//         <Space direction="vertical" style={{ width: '100%' }}>
//           <Progress
//             percent={percentage}
//             size="small"
//             status={percentage >= 70 ? 'success' : percentage >= 40 ? 'normal' : 'exception'}
//           />
//         </Space>
//       ),
//     },
//   ];

//   const tabItems = [
//     {
//       key: 'daily',
//       label: 'Daily Report',
//       children: (
//         <div>
//           <Space style={{ marginBottom: 16 }}>
//             <span>Select Date:</span>
//             <DatePicker
//               value={selectedDate}
//               onChange={(date) => setSelectedDate(date || dayjs())}
//               format="YYYY-MM-DD"
//             />
//             <Tag color="blue">{selectedDate.format('dddd, MMMM D, YYYY')}</Tag>
//           </Space>
//           <Table
//             columns={dailyColumns}
//             dataSource={getDailyReport()}
//             rowKey="id"
//             pagination={{ pageSize: 10 }}
//             locale={{ emptyText: 'No attendance records for this date' }}
//           />
//         </div>
//       )
//     },
//     {
//       key: 'weekly',
//       label: 'Weekly Report',
//       children: (
//         <div>
//           <Space style={{ marginBottom: 16 }}>
//             <span>Select Date (to view its week):</span>
//             <DatePicker
//               value={selectedDate}
//               onChange={(date) => setSelectedDate(date || dayjs())}
//               format="YYYY-MM-DD"
//             />
//             <Tag color="green">
//               Week containing {selectedDate.format('MMMM D, YYYY')}
//             </Tag>
//           </Space>
//           <Table
//             columns={weeklyColumns}
//             dataSource={getWeeklyReport()}
//             rowKey="labourId"
//             pagination={{ pageSize: 10 }}
//             locale={{ emptyText: 'No attendance records for this week' }}
//           />
//         </div>
//       )
//     },
//     {
//       key: 'monthly',
//       label: 'Monthly Report',
//       children: (
//         <div>
//           <Space style={{ marginBottom: 16 }}>
//             <span>Select Month:</span>
//             <DatePicker
//               value={selectedDate}
//               onChange={(date) => setSelectedDate(date || dayjs())}
//               picker="month"
//             />
//             <Tag color="purple">{selectedDate.format('MMMM YYYY')}</Tag>
//           </Space>
//           <Table
//             columns={monthlyColumns}
//             dataSource={getMonthlyReport()}
//             rowKey="labourId"
//             pagination={{ pageSize: 10 }}
//             locale={{ emptyText: 'No attendance records for this month' }}
//           />
//         </div>
//       )
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <Card title="Attendance Reports">
//         <Tabs defaultActiveKey="daily" items={tabItems} />
//       </Card>
//     </div>
//   );
// };

// export default Reports;
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  DatePicker,
  message,
  Popconfirm,
  Tabs,
  Progress,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getLoggedInManager,
  getAttendance,
  saveAttendance,
  getLabours,
} from "../utils/storage";

dayjs.extend(isBetween);

const Reports = () => {
  const [manager, setManager] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [labours, setLabours] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const loggedIn = getLoggedInManager();
    if (!loggedIn) {
      message.error("No manager logged in!");
      return;
    }

    setManager(loggedIn);

    const labourList = getLabours(loggedIn.email) || [];
    setLabours(labourList);

    const allAttendance = getAttendance(loggedIn.email) || [];
    const filtered = allAttendance.filter((a) =>
      labourList.some((l) => l.id === a.labourId)
    );

    if (filtered.length !== allAttendance.length) {
      saveAttendance(loggedIn.email, filtered);
    }

    setAttendance(filtered);
  }, []);

  // Helper - Get Labour Info (using internal ID)
  const getLabourInfo = (labourId) => {
    const labour = labours.find((l) => l.id === labourId);
    if (!labour)
      return { empId: "-", name: "-", workType: "-" };
    return {
      empId: labour.empId || "N/A",
      name: `${labour.name || ""}`.trim(),
      workType: labour.workType || "-",
    };
  };

  // Calculate hours and duration
  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return null;
    try {
      const start = new Date(`2024-01-01 ${inTime}`);
      const end = new Date(`2024-01-01 ${outTime}`);
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      return { hours, mins, totalHours: diff / (1000 * 60 * 60) };
    } catch {
      return null;
    }
  };

  const formatDuration = (inTime, outTime) => {
    const duration = calculateHours(inTime, outTime);
    if (!duration) return "-";
    return `${duration.hours}h ${duration.mins}m`;
  };

  const calculatePercentage = (inTime, outTime, standardHours = 8) => {
    const duration = calculateHours(inTime, outTime);
    if (!duration) return 0;
    return Math.min(Math.round((duration.totalHours / standardHours) * 100), 100);
  };

  const handleDelete = (recordId) => {
    if (!manager) return;
    const updated = attendance.filter((a) => a.id !== recordId);
    saveAttendance(manager.email, updated);
    setAttendance(updated);
    message.success("Attendance record deleted successfully!");
  };

  // 📅 Daily Report
  const getDailyReport = () => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    return attendance
      .filter((a) => a.date === dateStr && a.clockOut)
      .map((record, index) => {
        const info = getLabourInfo(record.labourId);
        return {
          serialNo: index + 1,
          empId: info.empId,
          labourName: info.name,
          workType: info.workType,
          clockIn: record.clockIn,
          clockOut: record.clockOut,
          duration: formatDuration(record.clockIn, record.clockOut),
          percentage: calculatePercentage(record.clockIn, record.clockOut),
          id: record.id,
        };
      });
  };

  const dailyColumns = [
    { title: "S.No", dataIndex: "serialNo", width: 60 },
    { title: "Labour ID", dataIndex: "empId", width: 100 },
    { title: "Labour Name", dataIndex: "labourName", width: 150 },
    { title: "Work Type", dataIndex: "workType", width: 120 },
    { title: "Clock In", dataIndex: "clockIn", width: 100 },
    { title: "Clock Out", dataIndex: "clockOut", width: 100 },
    { title: "Duration", dataIndex: "duration", width: 100 },
    {
      title: "Hours Worked (8 hrs/day)",
      dataIndex: "percentage",
      width: 250,
      render: (percentage) => (
        <Progress
          percent={percentage}
          size="small"
          status={
            percentage >= 100
              ? "success"
              : percentage >= 75
              ? "normal"
              : "exception"
          }
        />
      ),
    },
    {
      title: "Action",
      width: 100,
      render: (record) => (
        <Popconfirm
          title="Delete this record?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  // 📊 Weekly Report
  const getWeeklyReport = () => {
    const startOfWeek = selectedDate.startOf("week");
    const endOfWeek = selectedDate.endOf("week");

    const weekAttendance = attendance.filter((a) => {
      const attDate = dayjs(a.date);
      return attDate.isBetween(startOfWeek, endOfWeek, "day", "[]") && a.clockOut;
    });

    const labourMap = {};
    weekAttendance.forEach((record) => {
      const info = getLabourInfo(record.labourId);
      if (!labourMap[record.labourId]) {
        labourMap[record.labourId] = {
          empId: info.empId,
          labourName: info.name,
          workType: info.workType,
          dates: new Set(),
        };
      }
      labourMap[record.labourId].dates.add(record.date);
    });

    return Object.values(labourMap).map((l, i) => ({
      serialNo: i + 1,
      ...l,
      daysAttended: l.dates.size,
      totalDays: 7,
      percentage: Math.round((l.dates.size / 7) * 100),
    }));
  };

  const weeklyColumns = [
    { title: "S.No", dataIndex: "serialNo", width: 60 },
    { title: "Labour ID", dataIndex: "empId", width: 100 },
    { title: "Labour Name", dataIndex: "labourName", width: 150 },
    { title: "Work Type", dataIndex: "workType", width: 120 },
    {
      title: "Days Attended",
      dataIndex: "daysAttended",
      render: (days, record) => (
        <Tag color={days >= 5 ? "green" : days >= 3 ? "orange" : "red"}>
          {days} / {record.totalDays} days
        </Tag>
      ),
    },
    {
      title: "Attendance %",
      dataIndex: "percentage",
      render: (p) => <Progress percent={p} size="small" />,
    },
  ];

  // 📅 Monthly Report
  const getMonthlyReport = () => {
    const startOfMonth = selectedDate.startOf("month");
    const endOfMonth = selectedDate.endOf("month");
    const daysInMonth = selectedDate.daysInMonth();

    const monthAttendance = attendance.filter((a) => {
      const attDate = dayjs(a.date);
      return attDate.isBetween(startOfMonth, endOfMonth, "day", "[]") && a.clockOut;
    });

    const labourMap = {};
    monthAttendance.forEach((record) => {
      const info = getLabourInfo(record.labourId);
      if (!labourMap[record.labourId]) {
        labourMap[record.labourId] = {
          empId: info.empId,
          labourName: info.name,
          workType: info.workType,
          dates: new Set(),
        };
      }
      labourMap[record.labourId].dates.add(record.date);
    });

    return Object.values(labourMap).map((l, i) => ({
      serialNo: i + 1,
      ...l,
      daysAttended: l.dates.size,
      totalDays: daysInMonth,
      percentage: Math.round((l.dates.size / daysInMonth) * 100),
    }));
  };

  const monthlyColumns = [
    { title: "S.No", dataIndex: "serialNo", width: 60 },
    { title: "Labour ID", dataIndex: "empId", width: 100 },
    { title: "Labour Name", dataIndex: "labourName", width: 150 },
    { title: "Work Type", dataIndex: "workType", width: 120 },
    {
      title: "Days Attended",
      dataIndex: "daysAttended",
      render: (days, record) => (
        <Tag color={days >= 20 ? "green" : days >= 10 ? "orange" : "red"}>
          {days} / {record.totalDays} days
        </Tag>
      ),
    },
    {
      title: "Attendance %",
      dataIndex: "percentage",
      render: (p) => <Progress percent={p} size="small" />,
    },
  ];

  // 📤 Export to Excel
  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // 📄 Export to PDF
  const exportToPDF = (data, fileName) => {
    const doc = new jsPDF();
    doc.text(fileName, 14, 10);
    doc.autoTable({
      head: [Object.keys(data[0] || {})],
      body: data.map((row) => Object.values(row)),
      startY: 20,
    });
    doc.save(`${fileName}.pdf`);
  };

  const tabItems = [
    {
      key: "daily",
      label: "Daily Report",
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <DatePicker
              value={selectedDate}
              onChange={(d) => setSelectedDate(d || dayjs())}
              format="YYYY-MM-DD"
            />
            <Button onClick={() => exportToExcel(getDailyReport(), "DailyReport")}>
              Export Excel
            </Button>
            <Button onClick={() => exportToPDF(getDailyReport(), "DailyReport")}>
              Export PDF
            </Button>
          </Space>
          <Table
            columns={dailyColumns}
            dataSource={getDailyReport()}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: "weekly",
      label: "Weekly Report",
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <DatePicker
              value={selectedDate}
              onChange={(d) => setSelectedDate(d || dayjs())}
              format="YYYY-MM-DD"
            />
            <Button onClick={() => exportToExcel(getWeeklyReport(), "WeeklyReport")}>
              Export Excel
            </Button>
            <Button onClick={() => exportToPDF(getWeeklyReport(), "WeeklyReport")}>
              Export PDF
            </Button>
          </Space>
          <Table
            columns={weeklyColumns}
            dataSource={getWeeklyReport()}
            rowKey="empId"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: "monthly",
      label: "Monthly Report",
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <DatePicker
              picker="month"
              value={selectedDate}
              onChange={(d) => setSelectedDate(d || dayjs())}
            />
            <Button onClick={() => exportToExcel(getMonthlyReport(), "MonthlyReport")}>
              Export Excel
            </Button>
            <Button onClick={() => exportToPDF(getMonthlyReport(), "MonthlyReport")}>
              Export PDF
            </Button>
          </Space>
          <Table
            columns={monthlyColumns}
            dataSource={getMonthlyReport()}
            rowKey="empId"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Attendance Reports">
        <Tabs defaultActiveKey="daily" items={tabItems} />
      </Card>
    </div>
  );
};

export default Reports;

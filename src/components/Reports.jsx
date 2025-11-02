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
import { Table, Button, Card, DatePicker, message, Popconfirm, Tabs, Progress, Space, Tag } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  getLoggedInManager,
  getAttendance,
  saveAttendance,
  getLabours,
} from "../utils/storage";

// Extend dayjs with isBetween plugin for date range filtering
dayjs.extend(isBetween);

const Reports = () => {
  const [manager, setManager] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const loggedIn = getLoggedInManager();
    if (!loggedIn) {
      message.error("No manager logged in!");
      return;
    }

    setManager(loggedIn);

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

  // Calculate hours from clock in/out times
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

  // DAILY REPORT - Show attendance with hours percentage per employee
  const getDailyReport = () => {
    const dateStr = selectedDate.format('YYYY-MM-DD');
    return attendance
      .filter(a => a.date === dateStr && a.clockOut)
      .map(record => ({
        ...record,
        percentage: calculatePercentage(record.clockIn, record.clockOut),
        duration: formatDuration(record.clockIn, record.clockOut)
      }));
  };

  const dailyColumns = [
    { title: "Labour Name", dataIndex: "labourName", width: 150 },
    { title: "Work Type", dataIndex: "workType", width: 120 },
    { title: "Clock In", dataIndex: "clockIn", width: 100 },
    { title: "Clock Out", dataIndex: "clockOut", width: 100 },
    { title: "Duration", dataIndex: "duration", width: 100 },
    {
      title: "Hours Worked (Based on 8hr day)",
      dataIndex: "percentage",
      width: 250,
      render: (percentage) => (
        <Space>
          <Progress
            percent={percentage}
            size="small"
            style={{ width: 150 }}
            status={percentage >= 100 ? 'success' : percentage >= 75 ? 'normal' : 'exception'}
          />
        </Space>
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

  // WEEKLY REPORT - Group by employee and show days attended with progress bar
  const getWeeklyReport = () => {
    const startOfWeek = selectedDate.startOf('week');
    const endOfWeek = selectedDate.endOf('week');

    const weekAttendance = attendance.filter(a => {
      const attDate = dayjs(a.date);
      return attDate.isBetween(startOfWeek, endOfWeek, 'day', '[]') && a.clockOut;
    });

    // Group by labour
    const labourMap = {};
    weekAttendance.forEach(record => {
      if (!labourMap[record.labourId]) {
        labourMap[record.labourId] = {
          labourId: record.labourId,
          labourName: record.labourName,
          workType: record.workType,
          dates: new Set()
        };
      }
      labourMap[record.labourId].dates.add(record.date);
    });

    return Object.values(labourMap).map(labour => ({
      ...labour,
      daysAttended: labour.dates.size,
      totalDays: 7,
      percentage: Math.round((labour.dates.size / 7) * 100)
    }));
  };

  const weeklyColumns = [
    { title: "Labour Name", dataIndex: "labourName", width: 150 },
    { title: "Work Type", dataIndex: "workType", width: 120 },
    {
      title: "Days Attended",
      dataIndex: "daysAttended",
      width: 120,
      render: (days, record) => (
        <Tag color={days >= 5 ? 'green' : days >= 3 ? 'orange' : 'red'}>
          {days} / {record.totalDays} days
        </Tag>
      )
    },
    {
      title: "Attendance Rate",
      dataIndex: "percentage",
      width: 300,
      render: (percentage) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Progress
            percent={percentage}
            size="small"
            status={percentage >= 70 ? 'success' : percentage >= 40 ? 'normal' : 'exception'}
          />
        </Space>
      ),
    },
  ];

  // MONTHLY REPORT - Group by employee and show days attended with progress bar
  const getMonthlyReport = () => {
    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');
    const daysInMonth = selectedDate.daysInMonth();

    const monthAttendance = attendance.filter(a => {
      const attDate = dayjs(a.date);
      return attDate.isBetween(startOfMonth, endOfMonth, 'day', '[]') && a.clockOut;
    });

    // Group by labour
    const labourMap = {};
    monthAttendance.forEach(record => {
      if (!labourMap[record.labourId]) {
        labourMap[record.labourId] = {
          labourId: record.labourId,
          labourName: record.labourName,
          workType: record.workType,
          dates: new Set()
        };
      }
      labourMap[record.labourId].dates.add(record.date);
    });

    return Object.values(labourMap).map(labour => ({
      ...labour,
      daysAttended: labour.dates.size,
      totalDays: daysInMonth,
      percentage: Math.round((labour.dates.size / daysInMonth) * 100)
    }));
  };

  const monthlyColumns = [
    { title: "Labour Name", dataIndex: "labourName", width: 150 },
    { title: "Work Type", dataIndex: "workType", width: 120 },
    {
      title: "Days Attended",
      dataIndex: "daysAttended",
      width: 120,
      render: (days, record) => (
        <Tag color={days >= 20 ? 'green' : days >= 10 ? 'orange' : 'red'}>
          {days} / {record.totalDays} days
        </Tag>
      )
    },
    {
      title: "Attendance Rate",
      dataIndex: "percentage",
      width: 300,
      render: (percentage) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Progress
            percent={percentage}
            size="small"
            status={percentage >= 70 ? 'success' : percentage >= 40 ? 'normal' : 'exception'}
          />
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'daily',
      label: 'Daily Report',
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <span>Select Date:</span>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || dayjs())}
              format="YYYY-MM-DD"
            />
            <Tag color="blue">{selectedDate.format('dddd, MMMM D, YYYY')}</Tag>
          </Space>
          <Table
            columns={dailyColumns}
            dataSource={getDailyReport()}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'No attendance records for this date' }}
          />
        </div>
      )
    },
    {
      key: 'weekly',
      label: 'Weekly Report',
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <span>Select Date (to view its week):</span>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || dayjs())}
              format="YYYY-MM-DD"
            />
            <Tag color="green">
              Week containing {selectedDate.format('MMMM D, YYYY')}
            </Tag>
          </Space>
          <Table
            columns={weeklyColumns}
            dataSource={getWeeklyReport()}
            rowKey="labourId"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'No attendance records for this week' }}
          />
        </div>
      )
    },
    {
      key: 'monthly',
      label: 'Monthly Report',
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <span>Select Month:</span>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || dayjs())}
              picker="month"
            />
            <Tag color="purple">{selectedDate.format('MMMM YYYY')}</Tag>
          </Space>
          <Table
            columns={monthlyColumns}
            dataSource={getMonthlyReport()}
            rowKey="labourId"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'No attendance records for this month' }}
          />
        </div>
      )
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

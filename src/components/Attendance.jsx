// import React, { useEffect, useState } from "react";
// import { Table, Button, Card, message, Tag } from "antd";
// import {
//   getLoggedInManager,
//   getLabours,
//   getAttendance,
//   saveAttendance,
// } from "../utils/storage";

// const Attendance = () => {
//   const [manager, setManager] = useState(null);
//   const [labours, setLabours] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loadingIds, setLoadingIds] = useState([]); // for visual loading effect

//   useEffect(() => {
//     const loggedIn = getLoggedInManager();
//     if (!loggedIn) {
//       message.error("No manager logged in!");
//       return;
//     }
//     setManager(loggedIn);

//     // Load labours
//     const labourList = getLabours(loggedIn.email) || [];
//     setLabours(labourList);

//     // Remove attendance of deleted labours automatically
//     const allAttendance = getAttendance(loggedIn.email) || [];
//     const filteredAttendance = allAttendance.filter((a) =>
//       labourList.some((l) => l.id === a.labourId)
//     );

//     if (filteredAttendance.length !== allAttendance.length) {
//       saveAttendance(loggedIn.email, filteredAttendance);
//     }

//     setAttendance(filteredAttendance);
//   }, []);

//   const markAttendance = (labour, type) => {
//     if (!manager) return;

//     const date = new Date().toLocaleDateString();
//     const time = new Date().toLocaleTimeString();

//     let currentAttendance = getAttendance(manager.email);
//     let existing = currentAttendance.find(
//       (r) => r.labourId === labour.id && r.date === date
//     );

//     setLoadingIds((prev) => [...prev, labour.id]); // add loader

//     setTimeout(() => {
//       if (type === "Clock In") {
//         if (existing && existing.clockIn) {
//           message.warning(`${labour.name} already clocked in today.`);
//           setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
//           return;
//         }

//         if (!existing) {
//           existing = {
//             id: Date.now(),
//             labourId: labour.id,
//             labourName: labour.name,
//             workType: labour.workType,
//             date,
//             clockIn: time,
//             clockOut: "",
//           };
//           currentAttendance.push(existing);
//         } else {
//           existing.clockIn = time;
//         }

//         message.success(`${labour.name} clocked in at ${time}`);
//       } else if (type === "Clock Out") {
//         if (!existing) {
//           message.warning(`${labour.name} has not clocked in yet.`);
//           setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
//           return;
//         }
//         if (existing.clockOut) {
//           message.warning(`${labour.name} already clocked out today.`);
//           setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
//           return;
//         }

//         existing.clockOut = time;
//         message.success(`${labour.name} clocked out at ${time}`);
//       }

//       saveAttendance(manager.email, currentAttendance);
//       setAttendance([...currentAttendance]);
//       setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
//     }, 700); // simulate smooth effect
//   };

//   const getTodayStatus = (labourId) => {
//     const today = new Date().toLocaleDateString();
//     return attendance.find((r) => r.labourId === labourId && r.date === today);
//   };

//   const columns = [
//     { title: "Labour Name", dataIndex: "name" },
//     { title: "Work Type", dataIndex: "workType" },
//     {
//       title: "Status",
//       render: (_, record) => {
//         const todayStatus = getTodayStatus(record.id);
//         if (!todayStatus) return <Tag color="default">Not Clocked In</Tag>;
//         if (todayStatus && todayStatus.clockIn && !todayStatus.clockOut)
//           return <Tag color="green">Working</Tag>;
//         if (todayStatus && todayStatus.clockOut)
//           return <Tag color="blue">Completed</Tag>;
//       },
//     },
//     {
//       title: "Actions",
//       render: (_, record) => {
//         const todayStatus = getTodayStatus(record.id);
//         const clockedIn = todayStatus?.clockIn;
//         const clockedOut = todayStatus?.clockOut;

//         return (
//           <>
//             <Button
//               type="primary"
//               loading={loadingIds.includes(record.id)}
//               onClick={() => markAttendance(record, "Clock In")}
//               style={{ marginRight: 8 }}
//               disabled={clockedIn}
//             >
//               {clockedIn ? "Clocked In" : "Clock In"}
//             </Button>
//             <Button
//               danger
//               loading={loadingIds.includes(record.id)}
//               onClick={() => markAttendance(record, "Clock Out")}
//               disabled={!clockedIn || clockedOut}
//             >
//               {clockedOut ? "Clocked Out" : "Clock Out"}
//             </Button>
//           </>
//         );
//       },
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <Card title="Attendance Panel">
//         <Table
//           rowKey="id"
//           columns={columns}
//           dataSource={labours}
//           pagination={false}
//         />
//       </Card>
//     </div>
//   );
// };

// export default Attendance;

import React, { useEffect, useState } from "react";
import { Table, Button, Card, message, Tag } from "antd";
import {
  getLoggedInManager,
  getLabours,
  getAttendance,
  saveAttendance,
} from "../utils/storage";

const Attendance = () => {
  const [manager, setManager] = useState(null);
  const [labours, setLabours] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

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
    const filteredAttendance = allAttendance.filter((a) =>
      labourList.some((l) => l.id === a.labourId)
    );

    if (filteredAttendance.length !== allAttendance.length) {
      saveAttendance(loggedIn.email, filteredAttendance);
    }

    setAttendance(filteredAttendance);
  }, []);

  const markAttendance = (labour, type) => {
    if (!manager) return;

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    let currentAttendance = getAttendance(manager.email);
    let existing = currentAttendance.find(
      (r) => r.labourId === labour.id && r.date === date
    );

    setLoadingIds((prev) => [...prev, labour.id]);

    setTimeout(() => {
      if (type === "Clock In") {
        if (existing && existing.clockIn) {
          message.warning(`${labour.name} already clocked in today.`);
          setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
          return;
        }

        if (!existing) {
          existing = {
            id: Date.now(),
            labourId: labour.id,
            labourName: labour.name,
            workType: labour.workType,
            date,
            clockIn: time,
            clockOut: "",
          };
          currentAttendance.push(existing);
        } else {
          existing.clockIn = time;
        }

        message.success(`${labour.name} clocked in at ${time}`);
      } else if (type === "Clock Out") {
        if (!existing) {
          message.warning(`${labour.name} has not clocked in yet.`);
          setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
          return;
        }
        if (existing.clockOut) {
          message.warning(`${labour.name} already clocked out today.`);
          setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
          return;
        }

        existing.clockOut = time;
        message.success(`${labour.name} clocked out at ${time}`);
      }

      saveAttendance(manager.email, currentAttendance);
      setAttendance([...currentAttendance]);
      setLoadingIds((prev) => prev.filter((id) => id !== labour.id));
    }, 700);
  };

  const getTodayStatus = (labourId) => {
    const today = new Date().toLocaleDateString();
    return attendance.find((r) => r.labourId === labourId && r.date === today);
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    { title: "Labour Name", dataIndex: "name" },
    { title: "Work Type", dataIndex: "workType" },
    {
      title: "Status",
      render: (_, record) => {
        const todayStatus = getTodayStatus(record.id);
        if (!todayStatus) return <Tag color="default">Not Clocked In</Tag>;
        if (todayStatus && todayStatus.clockIn && !todayStatus.clockOut)
          return <Tag color="green">Working</Tag>;
        if (todayStatus && todayStatus.clockOut)
          return <Tag color="blue">Completed</Tag>;
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        const todayStatus = getTodayStatus(record.id);
        const clockedIn = todayStatus?.clockIn;
        const clockedOut = todayStatus?.clockOut;

        return (
          <>
            <Button
              type="primary"
              loading={loadingIds.includes(record.id)}
              onClick={() => markAttendance(record, "Clock In")}
              style={{ marginRight: 8 }}
              disabled={clockedIn}
            >
              {clockedIn ? "Clocked In" : "Clock In"}
            </Button>
            <Button
              danger
              loading={loadingIds.includes(record.id)}
              onClick={() => markAttendance(record, "Clock Out")}
              disabled={!clockedIn || clockedOut}
            >
              {clockedOut ? "Clocked Out" : "Clock Out"}
            </Button>
          </>
        );
      },
    },
  ];

  // 📊 Summary
  const today = new Date().toLocaleDateString();
  const todayAttendance = attendance.filter((a) => a.date === today);
  const totalClockedIn = todayAttendance.filter((a) => a.clockIn).length;
  const totalCompleted = todayAttendance.filter((a) => a.clockOut).length;

  return (
    <div style={{ padding: 20 }}>
      <Card title="Attendance Panel">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={labours}
          pagination={false}
        />

        <div style={{ marginTop: 20 }}>
          <Card>
            <h4>Total Clocked In Today: {totalClockedIn}</h4>
            <h4>Total Completed Work: {totalCompleted}</h4>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default Attendance;

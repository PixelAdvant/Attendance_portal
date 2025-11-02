// ========================================================
// 🌟 Local Storage Utility for Labour Attendance App
// ========================================================

// ---------- MANAGER FUNCTIONS ----------
export const getManagers = () =>
  JSON.parse(localStorage.getItem("managers") || "[]");

export const saveManagers = (managers) =>
  localStorage.setItem("managers", JSON.stringify(managers));

export const addManager = (manager) => {
  const managers = getManagers();
  managers.push(manager);
  saveManagers(managers);
};

// ---------- LOGIN ----------
export const getLoggedInManager = () =>
  JSON.parse(localStorage.getItem("loggedInManager") || "null");

export const setLoggedInManager = (manager) =>
  localStorage.setItem("loggedInManager", JSON.stringify(manager));

export const logoutManager = () =>
  localStorage.removeItem("loggedInManager");

// ---------- LABOUR FUNCTIONS ----------
export const getLabours = (email) =>
  JSON.parse(localStorage.getItem(`labours_${email}`) || "[]");

export const saveLabours = (email, labours) =>
  localStorage.setItem(`labours_${email}`, JSON.stringify(labours));

export const addLabour = (email, labour) => {
  const labours = getLabours(email);
  labours.push({ ...labour, id: Date.now() });
  saveLabours(email, labours);
};

// ---------- ATTENDANCE FUNCTIONS ----------
export const getAttendance = (email) =>
  JSON.parse(localStorage.getItem(`attendance_${email}`) || "[]");

export const saveAttendance = (email, attendance) =>
  localStorage.setItem(`attendance_${email}`, JSON.stringify(attendance));

// ---------- SETTINGS ----------
export const getSettings = () =>
  JSON.parse(localStorage.getItem("settings") || "{}");

export const saveSettings = (settings) =>
  localStorage.setItem("settings", JSON.stringify(settings));

// ---------- UTILITY ----------
export const clearAllData = () => {
  localStorage.clear();
  console.log("✅ All data cleared from localStorage!");
};

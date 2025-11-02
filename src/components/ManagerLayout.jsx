import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Routes, Route, useNavigate } from "react-router-dom";
import LabourList from "./LabourList";
import Attendance from "./Attendance";
import Reports from "./Reports";
import Settings from "./Settings";
import { logoutManager } from "../utils/storage";

const { Sider, Content } = Layout;

const ManagerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutManager();
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            onClick={() => navigate("/portal/labours")}
          >
            Labour List
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<ClockCircleOutlined />}
            onClick={() => navigate("/portal/attendance")}
          >
            Attendance
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<BarChartOutlined />}
            onClick={() => navigate("/portal/reports")}
          >
            Reports
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<SettingOutlined />}
            onClick={() => navigate("/portal/settings")}
          >
            Settings
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="labours" element={<LabourList />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;

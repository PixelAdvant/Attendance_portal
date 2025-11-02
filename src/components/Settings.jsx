import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const Settings = () => (
  <div style={{ maxWidth: 700, margin: "auto" }}>
    <Card>
      <Title level={3}>Developer Access Control (Future Enhancement)</Title>
      <Paragraph>
        This area is for future role-based permissions.
        Currently, all managers have full control:
      </Paragraph>
      <ul>
        <li>✅ Add/Edit/Delete Labours</li>
        <li>✅ Record Attendance</li>
        <li>✅ View Reports</li>
      </ul>
      <Paragraph>
        Future versions will include:
        - Developer admin role  
        - Manager restrictions  
        - Report exports  
        - Notifications  
      </Paragraph>
    </Card>
  </div>
);

export default Settings;

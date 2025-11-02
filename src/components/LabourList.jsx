import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Card } from "antd";
import {
  getLoggedInManager,
  getLabours,
  addLabour,
  saveLabours,
} from "../utils/storage";

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

  const columns = [
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
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            + Add Labour
          </Button>
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

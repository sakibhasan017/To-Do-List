import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Picker } from '@react-native-picker/picker'; // Updated import

export default function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: task,
          completed: false,
          priority,
          dueDate,
          bgColor: getRandomColor(),
          textColor: getRandomColor(),
        },
      ]);
      setTask("");
      setPriority("Low");
      setDueDate("");
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setTask(task.text);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setShowModal(true);
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, text: task, priority, dueDate }
          : task
      )
    );
    setShowModal(false);
    setTask("");
    setPriority("Low");
    setDueDate("");
    setEditingTask(null);
  };

  const filterTasks = () => {
    switch (filter) {
      case "Completed":
        return tasks.filter((task) => task.completed);
      case "Pending":
        return tasks.filter((task) => !task.completed);
      case "High Priority":
        return tasks.filter((task) => task.priority === "High");
      case "Medium Priority":
        return tasks.filter((task) => task.priority === "Medium");
      case "Low Priority":
        return tasks.filter((task) => task.priority === "Low");
      default:
        return tasks;
    }
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your to-do..."
        value={task}
        onChangeText={setTask}
      />
      <Picker
        selectedValue={priority}
        style={styles.picker}
        onValueChange={(itemValue) => setPriority(itemValue)}
      >
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Enter due date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Add Task" onPress={addTask} />

      <Text style={styles.subtitle}>Filter Tasks</Text>
      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={(itemValue) => setFilter(itemValue)}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Completed" value="Completed" />
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="High Priority" value="High Priority" />
        <Picker.Item label="Medium Priority" value="Medium Priority" />
        <Picker.Item label="Low Priority" value="Low Priority" />
      </Picker>

      <FlatList
        data={filterTasks()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskItem, { backgroundColor: item.bgColor }]}
            onPress={() => toggleTask(item.id)}
          >
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completed,
                { color: item.textColor },
              ]}
            >
              {item.text}
            </Text>
            <Text>{item.dueDate ? `Due: ${item.dueDate}` : ""}</Text>
            <Text style={[styles.priority, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
            <TouchableOpacity onPress={() => startEditing(item)}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Edit your task..."
            value={task}
            onChangeText={setTask}
          />
          <Picker
            selectedValue={priority}
            style={styles.picker}
            onValueChange={(itemValue) => setPriority(itemValue)}
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Enter due date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
          />
          <Button title="Save" onPress={saveEdit} />
          <Button title="Cancel" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </View>
  );

  function getPriorityColor(priority) {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "black";
    }
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  taskText: { fontSize: 16 },
  completed: { textDecorationLine: "line-through", color: "gray" },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  priority: { fontSize: 14, marginTop: 5 },
  edit: { color: "blue", marginTop: 10 },
  delete: { color: "red", marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: "center", padding: 20 },
  picker: { marginBottom: 10 },
});

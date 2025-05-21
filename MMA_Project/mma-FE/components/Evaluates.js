import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { API_ROOT } from "../utilities/constants"; // Đảm bảo rằng bạn đã định nghĩa API_ROOT

const EvaluateForm = () => {
  const [form, setForm] = useState({
    rating: 1,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleRatingPress = (rating) => {
    setForm({ ...form, rating });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_ROOT}/evaluates`, form);
      alert("Đánh giá đã được gửi thành công!");
      setForm({ rating: 1, comment: "" });
    } catch (err) {
      console.error("Có lỗi xảy ra:", err.response ? err.response.data : err);
      alert("Không thể gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.label}>Rating:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
            <Text
              style={[
                styles.star,
                form.rating >= star
                  ? styles.starSelected
                  : styles.starUnselected,
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <InputField
        label="Comment"
        value={form.comment}
        onChangeText={(value) => setForm({ ...form, comment: value })}
        placeholder="Nhập nhận xét"
        multiline
        textArea
      />

      <Button
        title={loading ? "Đang gửi..." : "Gửi Đánh Giá"}
        onPress={handleSubmit}
        disabled={loading}
        color="#6200ea"
      />
    </ScrollView>
  );
};

const InputField = ({ label, textArea = false, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}:</Text>
    <TextInput style={[styles.input, textArea && styles.textArea]} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#6200ea",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
    letterSpacing: 0.5,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 30,
    justifyContent: "center",
  },
  star: {
    fontSize: 40,
    marginHorizontal: 5,
    transition: "color 0.3s ease-in-out",
  },
  starSelected: {
    color: "#ffd700",
  },
  starUnselected: {
    color: "#dcdcdc",
  },
  inputGroup: {
    marginBottom: 30,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 15,
    fontSize: 16,
    textAlign: "center",
  },
});

export default EvaluateForm;

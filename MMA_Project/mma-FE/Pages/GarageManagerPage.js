import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from "react-native-vector-icons";
import { Card, Title, Paragraph } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function GarageManagerPage({ navigation }) {
  const garageImage =
    "https://nnhome.com.vn/wp-content/uploads/2023/02/Thiet-ke-nha-xuong-gara-o-to-53.jpg";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: garageImage }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>GARAGE MANAGER</Text>
            <Text style={styles.headerSubtitle}>
              Quản lý garage chuyên nghiệp
            </Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Chào mừng đến với Hệ thống Quản lý Garage
          </Text>
          <Text style={styles.welcomeSubText}>
            Quản lý garage của bạn một cách hiệu quả
          </Text>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate("BookingPageManage")}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <MaterialIcons name="book-online" size={36} color="#6200ea" />
                <Title style={styles.cardTitle}>Lịch hẹn</Title>
                <Paragraph style={styles.cardDescription}>
                  Quản lý lịch hẹn
                </Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate("Report")}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <FontAwesome5 name="file-invoice" size={36} color="#6200ea" />
                <Title style={styles.cardTitle}>Báo cáo</Title>
                <Paragraph style={styles.cardDescription}>
                  Xem báo cáo và thống kê
                </Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate("Bill")}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Ionicons name="receipt-outline" size={36} color="#6200ea" />
                <Title style={styles.cardTitle}>Hóa đơn</Title>
                <Paragraph style={styles.cardDescription}>
                  Quản lý hóa đơn và thanh toán
                </Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate("Service")}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <MaterialIcons
                  name="miscellaneous-services"
                  size={36}
                  color="#6200ea"
                />
                <Title style={styles.cardTitle}>Dịch vụ</Title>
                <Paragraph style={styles.cardDescription}>
                  Quản lý các dịch vụ
                </Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>Thống kê nhanh</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Đặt lịch hôm nay</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Xe đang sửa chữa</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Hoàn thành hôm nay</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default GarageManagerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backgroundImage: {
    height: 200,
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuCard: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    height: 140,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  cardDescription: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
  },
  quickStats: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ea",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});

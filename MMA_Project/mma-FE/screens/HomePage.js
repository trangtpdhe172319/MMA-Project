import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { API_ROOT } from "../utilities/constants";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ServiceCard = ({ icon, title, description }) => (
  <TouchableOpacity style={styles.serviceCard}>
    <View style={styles.serviceIconContainer}>
      <MaterialCommunityIcons name={icon} size={32} color="#FFFFFF" />
    </View>
    <Text style={styles.serviceTitle}>{title}</Text>
    <Text style={styles.serviceDescription}>{description}</Text>
    <View style={styles.cardArrow}>
      <Ionicons name="arrow-forward" size={18} color="#3D5CFF" />
    </View>
  </TouchableOpacity>
);

const PromotionCard = ({ image, title, discount }) => (
  <TouchableOpacity style={styles.promotionCard}>
    <ImageBackground source={image} style={styles.promotionImage}>
      <View style={styles.promotionOverlay}>
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )}
        <Text style={styles.promotionTitle}>{title}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const HomePage = ({ navigation }) => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latitude = 21.028511;
  const longitude = 105.804817;

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_ROOT}/garages?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check what the API actually returns
        console.log("API Response:", data);

        // Assuming data may be nested in a property or need transformation
        const garageArray = Array.isArray(data)
          ? data
          : data.garages || data.data || data.results || [];

        setGarages(garageArray.slice(0, 3)); // Get only the first 3 garages
      } catch (error) {
        console.error("Error fetching garages:", error);
        setError(error.message);
        // Fallback to empty array if error occurs
        setGarages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, []);

  // Show loading or error states
  if (loading && garages.length === 0) {
    return (
      <View style={styles.garagesContainer}>
        <Text>Loading garages...</Text>
      </View>
    );
  }

  if (error && garages.length === 0) {
    return (
      <View style={styles.garagesContainer}>
        <Text>Error loading garages: {error}</Text>
      </View>
    );
  }
  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{
              uri: "https://hoangvietauto.vn/wp-content/uploads/E1BAA2nh-siC3AAu-xe-Lamborghini-cE1BBB1c-ngE1BAA7u.jpg",
            }}
            style={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitleSmall}>CHĂM SÓC XE</Text>
                <Text style={styles.heroTitle}>CARECARE</Text>
                <Text style={styles.heroSubtitle}>
                  Ứng dụng đặt lịch chăm sóc xe #1 Việt Nam
                </Text>
                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() => navigation.navigate("Booking")}
                >
                  <Text style={styles.heroButtonText}>ĐẶT LỊCH NGAY</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Quick Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100+</Text>
            <Text style={styles.statLabel}>Đối tác garage</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Khách hàng</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DỊCH VỤ NỔI BẬT</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <Ionicons name="arrow-forward" size={16} color="#3D5CFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.servicesGrid}>
            <ServiceCard
              icon="car-wrench"
              title="Bảo dưỡng xe"
              description="Bảo dưỡng định kỳ, thay dầu, lọc gió"
            />
            <ServiceCard
              icon="engine"
              title="Sửa chữa"
              description="Sửa chữa động cơ, hệ thống điện"
            />
            <ServiceCard
              icon="spray"
              title="Đồng sơn"
              description="Sơn xe, sửa chữa thân vỏ"
            />
            <ServiceCard
              icon="car-cog"
              title="Nâng cấp xe"
              description="Nâng cấp phụ kiện, âm thanh"
            />
          </View>
        </View>

        {/* Promotions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ƯU ĐÃI ĐẶC BIỆT</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <Ionicons name="arrow-forward" size={16} color="#3D5CFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promotionsScroll}
          >
            <PromotionCard
              image={{
                uri: "https://tructuyen.baominh.vn/wp-content/uploads/2023/10/POG09264-scaled.jpg",
              }}
              title="Bảo dưỡng định kỳ"
              discount="-20%"
            />
            <PromotionCard
              image={{
                uri: "https://bizweb.dktcdn.net/100/415/690/files/kiem-tra-o-to-truoc-khi-di-duong-xa-2.jpg?v=1678350482270",
              }}
              title="Kiểm tra 10 điểm an toàn"
              discount="MIỄN PHÍ"
            />
            <PromotionCard
              image={{
                uri: "https://images2.thanhnien.vn/528068263637045248/2024/2/8/5-sai-lam-rua-oto-tai-nhathanhnien-6rcmy-17073993573491085477991.jpg",
              }}
              title="Rửa xe trọn đời"
              discount="MIỄN PHÍ"
            />
          </ScrollView>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>VỀ CARECARE</Text>
            <Text style={styles.aboutText}>
              CareCare là ứng dụng đặt lịch chăm sóc xe hàng đầu Việt Nam, kết
              nối khách hàng với các garage uy tín. Chúng tôi cam kết mang đến
              trải nghiệm chăm sóc xe thuận tiện, minh bạch với chất lượng dịch
              vụ hàng đầu và giá cả cạnh tranh.
            </Text>

            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Đối tác uy tín</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="wallet" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Giá cả minh bạch</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="time" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Tiết kiệm thời gian</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.aboutButton}
              onPress={() => navigation.navigate("RegisterForm")}
            >
              <Text style={styles.aboutButtonText}>ĐĂNG KÝ GARAGE ĐỐI TÁC</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Garages */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>GARAGE NỔI BẬT</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <Ionicons name="arrow-forward" size={16} color="#3D5CFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.garagesContainer}>
            {garages.map((garage) => (
              <TouchableOpacity key={garage.id} style={styles.garageCard}>
                <Image
                  source={{
                    uri: garage.image || "https://via.placeholder.com/150x100",
                  }}
                  style={styles.garageImage}
                />
                <View style={styles.garageContent}>
                  <Text style={styles.garageName}>{garage.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {garage.rating || "N/A"}
                    </Text>
                    <Text style={styles.ratingCount}>
                      ({garage.ratingCount || 0})
                    </Text>
                  </View>
                  <View style={styles.garageLocation}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#8A94A6"
                    />
                    <Text style={styles.locationText}>
                      {garage.location || "N/A"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },
  heroSection: {
    height: 350,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    height: "100%",
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  heroContent: {
    marginBottom: 30,
  },
  heroTitleSmall: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.9,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 10,
  },
  heroSubtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.9,
    width: "80%",
  },
  heroButton: {
    backgroundColor: "#3D5CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "#EEEEEE",
    alignSelf: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3D5CFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8A94A6",
  },
  sectionContainer: {
    padding: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#13132B",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3D5CFF",
    marginRight: 5,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: "#3D5CFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#13132B",
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 12,
    color: "#8A94A6",
    lineHeight: 18,
  },
  cardArrow: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  promotionsScroll: {
    flexDirection: "row",
    marginHorizontal: -5,
  },
  promotionCard: {
    width: width * 0.7,
    height: 180,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  promotionImage: {
    width: "100%",
    height: "100%",
  },
  promotionOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  discountBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#FF4D4F",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  discountText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  promotionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  aboutSection: {
    marginVertical: 15,
  },
  aboutContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#3D5CFF",
  },
  aboutTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  aboutText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: 25,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  aboutButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutButtonText: {
    color: "#3D5CFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  garagesContainer: {
    marginTop: 5,
  },
  garageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  garageImage: {
    width: 100,
    height: "100%",
  },
  garageContent: {
    padding: 15,
    flex: 1,
  },
  garageName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#13132B",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#13132B",
    marginLeft: 5,
    fontWeight: "500",
  },
  ratingCount: {
    fontSize: 12,
    color: "#8A94A6",
    marginLeft: 3,
  },
  garageLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    color: "#8A94A6",
    marginLeft: 5,
  },
});

export default HomePage;

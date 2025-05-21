import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import GarageManagerPage from "./Pages/GarageManagerPage";
import MapScreen from "./screens/MapScreen";
import BookingPageManage from "./Pages/BookingPageManage/BookingPageManage";
import ReportPage from "./Pages/ReportPage/ReportPage";
import ServiceManager from "./Pages/ServicePage/ServiceManager";
import BillManagementScreen from "./Pages/BillManager/BillManagementScreen";
// Add import for customer booking screen
import BookingScreen from "./screens/BookingScreen";
import HomePage from "./screens/HomePage";
import LoginScreen from "./Pages/Login/login";
import RegisterForm from "./Pages/Register/register";
import Icon from "react-native-vector-icons/FontAwesome";
import Evaluate from "./components/Evaluates";

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import AppHeader from "./components/AppHeader";

import BookingHistoryList from "./Pages/BookingHis/BookingHistory";
import BookingDetail from "./Pages/BookingDetail/BookingDetail";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for Home screens
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#6200ea" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Trang chủ", headerShown: false }}
      />
      <Stack.Screen
        name="RegisterForm"
        component={RegisterForm}
        options={{ title: "Đăng Ký Garage" }}
      />
    </Stack.Navigator>
  );
}

// Stack navigator for Garage screens
function GarageStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#6200ea" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="GarageManager"
        component={GarageManagerPage}
        options={{ title: "Quản lý gara", headerShown: false }}
      />
      <Stack.Screen
        name="BookingPageManage"
        component={BookingPageManage}
        options={{ title: "Quản lý lịch hẹn" }}
      />
      <Stack.Screen
        name="Report"
        component={ReportPage}
        options={{ title: "Báo cáo thống kê" }}
      />
      <Stack.Screen name="Service" component={ServiceManager} />
      <Stack.Screen name="Bill" component={BillManagementScreen} />
    </Stack.Navigator>
  );
}

function BookingHistoryScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#6200ea" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="BookingHistoryScreen"
        component={BookingHistoryList}
        options={{ title: "Lịch sử đặt lịch", headerShown: false }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetail}
        options={{ title: "Chi tiết lịch đặt", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <HomePage navigation={navigation} />
    </View>
  );
}

// Create a separate stack for auth screens
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterForm" component={RegisterForm} />
      <Stack.Screen
        name="BookingHistoryScreen"
        component={BookingHistoryScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ AsyncStorage khi component mount
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        console.log("check role", userData);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserRole(parsedUserData.role);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  // Hiển thị loading khi đang lấy dữ liệu
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Garage") {
              iconName = focused ? "car" : "car-outline";
            } else if (route.name === "Map") {
              iconName = focused ? "map" : "map-outline";
            } else if (route.name === "Booking") {
              iconName = focused ? "calendar" : "calendar-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#6200ea",
          tabBarInactiveTintColor: "#8A94A6",
          tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#F0F2F5",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: "Trang chủ",
            headerShown: false,
          }}
        />

        {/* Chỉ hiển thị tab Đặt lịch khi không phải admin */}
        {userRole !== "admin" && (
          <Tab.Screen
            name="Booking"
            component={BookingScreen}
            options={{
              title: "Đặt lịch",
              headerStyle: { backgroundColor: "#6200ea" },
              headerTintColor: "#fff",
            }}
          />
        )}

        {/* Chỉ hiển thị tab Garage khi là admin */}
        {userRole === "admin" && (
          <Tab.Screen
            name="Garage"
            component={GarageStack}
            options={{
              title: "Gara",
            }}
          />
        )}

        {/* Chỉ hiển thị tab Đánh giá khi không phải admin */}
        {userRole !== "admin" && (
          <Tab.Screen
            name="Danhgia"
            component={Evaluate}
            options={{
              title: "Đánh giá",
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="comment" size={size} color={color} />
              ),
            }}
          />
        )}

        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: "Bản đồ",
            headerStyle: { backgroundColor: "#6200ea" },
            headerTintColor: "#fff",
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Auth"
          component={AuthStack}
          options={{
            title: "Tài khoản",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

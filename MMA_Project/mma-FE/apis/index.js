import axios from "axios";
import { API_ROOT } from "../utilities/constants";


export const getNearbyGarages = async (lat, lon) => {
  try {
    const response = await axios.get(`${API_ROOT}/garages`, {
      params: { lat, lon },
    });
    return response.data.garages;
  } catch (error) {
    console.error("Lỗi khi lấy điểm sửa xe: ", error);
    return [];
  }
};

export const fetchBookings = async () => {
  const response = await axios.get(`${API_ROOT}/booking`);
  return response.data;
};

// Tạo mới một booking
export const createBooking = async (data) => {
  const response = await axios.post(`${API_ROOT}/booking`, data);
  return response.data;
};

// Cập nhật thông tin booking theo ID
export const updateBooking = async (id, data) => {
  const response = await axios.put(`${API_ROOT}/booking/${id}`, data);
  return response.data;
};


// 📌 Lấy lịch theo garageId và ngày
export const fetchSchedule = async (garageId, date) => {
  const response = await axios.get(`${API_ROOT}/schedule/${garageId}?date=${date}`);
  return response.data;
};

// 📌 Cập nhật trạng thái slot (đặt lịch hoặc hủy)
export const updateScheduleSlot = async (garageId, data) => {
  const response = await axios.put(`${API_ROOT}/schedule/update/${garageId}`, data);
  return response.data;
};


// Lấy thống kê theo ngày cho một garageId
export const fetchStatisticsByDay = async (garageId, date) => {
  const response = await axios.get(`${API_ROOT}/statistics/day/${garageId}`, {
      params: { date }
  });
  return response.data;
};

// Lấy thống kê theo tháng cho một garageId
export const fetchStatisticsByMonth = async (garageId, year, month) => {
  const response = await axios.get(`${API_ROOT}/statistics/month/${garageId}`, {
      params: { year, month }
  });
  return response.data;
};

// Lấy thống kê theo năm cho một garageId
export const fetchStatisticsByYear = async (garageId, year) => {
  const response = await axios.get(`${API_ROOT}/statistics/year/${garageId}`, {
      params: { year }
  });
  return response.data;
};

export const fetchServiceByName = async (serviceName) => {
  const response = await axios.get(`${API_ROOT}/service/byName/${serviceName}`);
  return response.data;
};

export const fetchAllServices = async () => {
  const response = await axios.get(`${API_ROOT}/service`);
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await axios.post(`${API_ROOT}/service`, serviceData);
  return response.data;
};

// Cập nhật dịch vụ theo ID
export const updateService = async (serviceId, updatedData) => {
  const response = await axios.put(`${API_ROOT}/service/${serviceId}`, updatedData);
  return response.data;
};

// Xóa dịch vụ theo ID
export const deleteService = async (serviceId) => {
  const response = await axios.delete(`${API_ROOT}/service/${serviceId}`);
  return response.data;
};

// Lấy tất cả hóa đơn
export const fetchBills = async () => {
  const response = await axios.get(`${API_ROOT}/bills`);
  return response.data;
};

// Tạo mới hóa đơn
export const createBill = async (data) => {
  const response = await axios.post(`${API_ROOT}/bills`, data);
  return response.data;
};

// Cập nhật hóa đơn theo ID
export const updateBill = async (id, data) => {
  const response = await axios.put(`${API_ROOT}/bills/${id}`, data);
  return response.data;
};

export const fetchBillsByDay = async (garageId, date) => {
  const response = await axios.get(`${API_ROOT}/bills/day/${garageId}`, {
    params: { date }
  });
  return response.data;
};

// Tổng kết bill trong một ngày
export const summarizeDailyBills = async (garageId, date) => {
  const response = await axios.get(`${API_ROOT}/bills/summarize/${garageId}`, {
    params: { date }
  });
  return response.data;
};
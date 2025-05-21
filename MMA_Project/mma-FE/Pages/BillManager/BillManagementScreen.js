import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  Text,
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BillHeader from './BillHeader';
import BillItem from './BillItem';
import BillModals from './BillModals';

import { 
  fetchBillsByDay, 
  summarizeDailyBills 
} from '../../apis';

const BillManagementScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bills, setBills] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const garageId = "65a4c1e2f4d2b41234abcd10"; // Replace with actual garage ID

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchDailyBills = useCallback(async () => {
    setLoading(true);
    try {
      const formattedDate = formatDate(selectedDate);
      const fetchedBills = await fetchBillsByDay(garageId, formattedDate);
      setBills(fetchedBills);
    } catch (error) {
      console.error('Error fetching daily bills:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, garageId]);

  const handleSummarizeBills = async () => {
    setLoading(true);
    try {
      const formattedDate = formatDate(selectedDate);
      const summary = await summarizeDailyBills(garageId, formattedDate);
      setDailySummary(summary);
      setShowSummaryModal(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Hiển thị thông báo lỗi từ server
        if (error.response.data.summary) {
          // Nếu ngày đã được tổng kết trước đó, hiển thị dữ liệu tổng kết đã có
          setDailySummary({
            billSummary: {
              totalCustomers: error.response.data.summary.totalCustomers,
              totalRevenue: error.response.data.summary.totalRevenue
            },
            statisticRecord: error.response.data.summary,
            isExisting: true
          });
          setShowSummaryModal(true);
        } else {
          alert(error.response.data.message);
        }
      } else {
        alert('Có lỗi xảy ra khi tổng kết bill');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch bills when date changes
  useEffect(() => {
    fetchDailyBills();
  }, [fetchDailyBills]);

  // Empty list component
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Không có hóa đơn cho ngày này</Text>
      <Text style={styles.emptySubText}>
        Chọn một ngày khác hoặc thêm hóa đơn mới
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BillHeader 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onDateChange={fetchDailyBills}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        handleSummarizeBills={handleSummarizeBills}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={bills}
          renderItem={({ item }) => <BillItem bill={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyListComponent}
        />
      )}

      <BillModals.SummaryModal 
        visible={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        dailySummary={dailySummary}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#0066cc',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
  }
});

export default BillManagementScreen;
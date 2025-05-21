import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterCard from './FilterCard';
import StatisticCards from './StatisticCards';
import ChartCard from './ChartCard';
import { fetchStatisticsByDay, fetchStatisticsByMonth, fetchStatisticsByYear } from '../../apis';
import Header from './Header';

const ReportPage = () => {
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [viewMode, setViewMode] = useState('day');
  const [error, setError] = useState(null);
  const garageId = "65a4c1e2f4d2b41234abcd10";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (viewMode === 'day' && date) {
        response = await fetchStatisticsByDay(garageId, date);
      } else if (viewMode === 'month' && month && year) {
        response = await fetchStatisticsByMonth(garageId, year, month);
      } else if (viewMode === 'year' && year) {
        response = await fetchStatisticsByYear(garageId, year);
      }
      setData(response);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [garageId, viewMode, date, month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        
        <FilterCard 
          viewMode={viewMode}
          setViewMode={setViewMode}
          date={date}
          setDate={setDate}
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          fetchData={fetchData}
          loading={loading}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          data && (
            <View style={styles.contentContainer}>
              <StatisticCards 
                totalCustomers={data.totalCustomers || 0} 
                totalRevenue={data.totalRevenue || 0}
                formatCurrency={formatCurrency}
              />
              
              <ChartCard 
                totalCustomers={data.totalCustomers || 0}
                totalRevenue={data.totalRevenue || 0}
                formatCurrency={formatCurrency}
              />
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  contentContainer: {
    marginTop: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 12,
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default ReportPage;
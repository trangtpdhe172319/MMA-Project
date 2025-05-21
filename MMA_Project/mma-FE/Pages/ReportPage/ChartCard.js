import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const ChartCard = ({ totalCustomers, totalRevenue }) => {
  const [chartType, setChartType] = useState('bar');
  const opacity = useSharedValue(0);
  const { width } = useWindowDimensions(); // Lấy chiều rộng màn hình linh hoạt
  const chartWidth = width * 0.85; // Đảm bảo biểu đồ không bị tràn màn hình

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: withTiming(0, { duration: 500 }) }],
  }));

  const barChartData = {
    labels: ['Khách hàng', 'Doanh thu (triệu)'],
    datasets: [
      {
        data: [totalCustomers, totalRevenue / 1000000],
      },
    ],
  };

  const lineChartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [
      {
        data: [
          totalRevenue * 0.7 / 1000000,
          totalRevenue * 0.85 / 1000000,
          totalRevenue * 0.65 / 1000000,
          totalRevenue * 0.8 / 1000000,
          totalRevenue * 0.9 / 1000000,
          totalRevenue / 1000000
        ],
        color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Doanh thu theo tháng (triệu)']
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
    style: { borderRadius: 12 },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#0066cc',
    },
    barPercentage: 0.6,
    fromZero: true,
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Biểu Đồ Thống Kê</Text>
        <View style={styles.chartToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, chartType === 'bar' && styles.activeToggle]} 
            onPress={() => setChartType('bar')}
          >
            <Ionicons name="stats-chart" size={20} color={chartType === 'bar' ? '#0066cc' : '#666'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, chartType === 'line' && styles.activeToggle]} 
            onPress={() => setChartType('line')}
          >
            <Ionicons name="trending-up" size={20} color={chartType === 'line' ? '#0066cc' : '#666'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        {chartType === 'bar' ? (
          <BarChart
            data={barChartData}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
            withInnerLines={true}
            segments={5}
          />
        ) : (
          <LineChart
            data={lineChartData}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
            withInnerLines={true}
            segments={5}
          />
        )}
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#0066cc' }]} />
          <Text style={styles.legendText}>{chartType === 'bar' ? 'Giá trị hiện tại' : 'Doanh thu theo tháng'}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 16,
    marginHorizontal: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeToggle: {
    backgroundColor: '#e0e0ff',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    borderRadius: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChartCard;

// app/(tabs)/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  RefreshControl,
} from 'react-native';
import { AppleHabitCard } from '../../components/AppleHabitCard';
import { AppleButton, AppleFAB } from '../../components/AppleButton';
import { AppleColors, AppleTypography, AppleSpacing } from '../../constants/AppleTheme';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));

  // Sample habits data
  const habits = [
    {
      id: '1',
      title: 'Morning Meditation',
      description: 'Start the day with 10 minutes of mindfulness',
      streak: 15,
      isCompleted: true,
      color: AppleColors.systemPurple,
    },
    {
      id: '2',
      title: 'Drink Water',
      description: '8 glasses throughout the day',
      streak: 7,
      isCompleted: false,
      color: AppleColors.systemCyan,
    },
    {
      id: '3',
      title: 'Exercise',
      description: '30 minutes of physical activity',
      streak: 12,
      isCompleted: true,
      color: AppleColors.systemOrange,
    },
    {
      id: '4',
      title: 'Read Before Bed',
      description: 'Read for at least 20 minutes',
      streak: 3,
      isCompleted: false,
      color: AppleColors.systemGreen,
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Animated header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.97],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ scale: headerScale }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning ☀️</Text>
            <Text style={styles.headerTitle}>Today's Habits</Text>
          </View>
          <View style={styles.streakContainer}>
            <Text style={styles.streakNumber}>15</Text>
            <Text style={styles.streakLabel}>Day Streak 🔥</Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Active Habits</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: AppleColors.systemGreen }]}>2</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: AppleColors.systemOrange }]}>2</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>

      {/* Scrollable Habit List */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Your Habits</Text>
        
        {habits.map((habit) => (
          <AppleHabitCard
            key={habit.id}
            title={habit.title}
            description={habit.description}
            streak={habit.streak}
            isCompleted={habit.isCompleted}
            color={habit.color}
            onPress={() => console.log('Habit pressed:', habit.id)}
            onComplete={() => console.log('Complete toggled:', habit.id)}
          />
        ))}

        {/* Empty State Hint */}
        <View style={styles.hintCard}>
          <Text style={styles.hintEmoji}>💡</Text>
          <Text style={styles.hintText}>
            Tap the + button to add a new habit
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <AppleFAB
        onPress={() => console.log('Add habit')}
        icon="+"
        color={AppleColors.systemBlue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppleColors.background.secondary,
  },
  header: {
    paddingHorizontal: AppleSpacing.base,
    paddingTop: AppleSpacing.md,
    paddingBottom: AppleSpacing.base,
    backgroundColor: AppleColors.background.secondary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    ...AppleTypography.subheadline,
    color: AppleColors.label.secondary,
    marginBottom: 4,
  },
  headerTitle: {
    ...AppleTypography.largeTitle,
    color: AppleColors.label.primary,
  },
  streakContainer: {
    alignItems: 'flex-end',
  },
  streakNumber: {
    ...AppleTypography.title1,
    fontWeight: '700',
    color: AppleColors.systemOrange,
  },
  streakLabel: {
    ...AppleTypography.caption1,
    color: AppleColors.label.secondary,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: AppleColors.background.tertiary,
    marginHorizontal: AppleSpacing.base,
    marginBottom: AppleSpacing.base,
    padding: AppleSpacing.base,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...AppleTypography.title1,
    fontWeight: '700',
    color: AppleColors.systemBlue,
    marginBottom: 4,
  },
  statLabel: {
    ...AppleTypography.caption1,
    color: AppleColors.label.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: AppleColors.separator.nonOpaque,
    marginVertical: AppleSpacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: AppleSpacing.sm,
  },
  sectionTitle: {
    ...AppleTypography.title3,
    color: AppleColors.label.primary,
    paddingHorizontal: AppleSpacing.base,
    marginBottom: AppleSpacing.md,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppleColors.fill.tertiary,
    marginHorizontal: AppleSpacing.base,
    marginTop: AppleSpacing.lg,
    padding: AppleSpacing.base,
    borderRadius: 12,
  },
  hintEmoji: {
    fontSize: 24,
    marginRight: AppleSpacing.md,
  },
  hintText: {
    ...AppleTypography.callout,
    color: AppleColors.label.secondary,
    flex: 1,
  },
});

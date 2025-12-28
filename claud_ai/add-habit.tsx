// app/add-habit.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppleButton } from '../components/AppleButton';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../constants/AppleTheme';

export default function AddHabitScreen() {
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(AppleColors.systemBlue);
  const [selectedFrequency, setSelectedFrequency] = useState('daily');

  const colors = [
    { name: 'Blue', value: AppleColors.systemBlue },
    { name: 'Purple', value: AppleColors.systemPurple },
    { name: 'Pink', value: AppleColors.systemPink },
    { name: 'Orange', value: AppleColors.systemOrange },
    { name: 'Green', value: AppleColors.systemGreen },
    { name: 'Cyan', value: AppleColors.systemCyan },
    { name: 'Teal', value: AppleColors.systemTeal },
    { name: 'Indigo', value: AppleColors.systemIndigo },
  ];

  const frequencies = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => console.log('Back')}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Habit</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Habit Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Habit Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning Meditation"
                placeholderTextColor={AppleColors.label.tertiary}
                value={habitName}
                onChangeText={setHabitName}
                maxLength={50}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a description (optional)"
                placeholderTextColor={AppleColors.label.tertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
              />
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Choose Color</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorGrid}
            >
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  onPress={() => setSelectedColor(color.value)}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: color.value,
                      transform: [{ scale: selectedColor === color.value ? 1.1 : 1 }],
                    },
                    selectedColor === color.value && styles.colorOptionSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  {selectedColor === color.value && (
                    <Text style={styles.colorCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Frequency */}
          <View style={styles.section}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {frequencies.map((freq) => (
                <TouchableOpacity
                  key={freq.value}
                  onPress={() => setSelectedFrequency(freq.value)}
                  style={[
                    styles.frequencyOption,
                    selectedFrequency === freq.value && styles.frequencyOptionSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      selectedFrequency === freq.value && styles.frequencyTextSelected,
                    ]}
                  >
                    {freq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reminder Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Reminder</Text>
            <TouchableOpacity style={styles.reminderCard} activeOpacity={0.7}>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderIcon}>🔔</Text>
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>Set Reminder</Text>
                  <Text style={styles.reminderSubtitle}>Get notified at a specific time</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>
              Building a new habit takes an average of 66 days. Stay consistent!
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomContainer}>
          <AppleButton
            title="Create Habit"
            onPress={() => console.log('Create habit')}
            variant="primary"
            size="large"
            fullWidth
            disabled={!habitName.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppleColors.background.secondary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppleSpacing.base,
    paddingVertical: AppleSpacing.md,
    backgroundColor: AppleColors.background.secondary,
    borderBottomWidth: 0.5,
    borderBottomColor: AppleColors.separator.nonOpaque,
  },
  cancelButton: {
    ...AppleTypography.body,
    color: AppleColors.systemBlue,
  },
  headerTitle: {
    ...AppleTypography.headline,
    fontWeight: '600',
    color: AppleColors.label.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: AppleSpacing.base,
    paddingBottom: AppleSpacing.xxxl,
  },
  section: {
    marginBottom: AppleSpacing.xl,
  },
  label: {
    ...AppleTypography.headline,
    color: AppleColors.label.primary,
    marginBottom: AppleSpacing.sm,
  },
  inputContainer: {
    backgroundColor: AppleColors.background.tertiary,
    borderRadius: AppleBorderRadius.button,
    ...AppleShadows.small,
  },
  input: {
    ...AppleTypography.body,
    color: AppleColors.label.primary,
    padding: AppleSpacing.base,
  },
  textAreaContainer: {
    minHeight: 100,
  },
  textArea: {
    minHeight: 80,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: AppleSpacing.md,
    paddingVertical: AppleSpacing.sm,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppleShadows.medium,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowOpacity: 0.15,
  },
  colorCheckmark: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  frequencyContainer: {
    flexDirection: 'row',
    backgroundColor: AppleColors.fill.tertiary,
    borderRadius: AppleBorderRadius.button,
    padding: 4,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: AppleSpacing.sm,
    alignItems: 'center',
    borderRadius: AppleBorderRadius.sm,
  },
  frequencyOptionSelected: {
    backgroundColor: AppleColors.background.tertiary,
    ...AppleShadows.small,
  },
  frequencyText: {
    ...AppleTypography.callout,
    color: AppleColors.label.secondary,
    fontWeight: '500',
  },
  frequencyTextSelected: {
    color: AppleColors.label.primary,
    fontWeight: '600',
  },
  reminderCard: {
    backgroundColor: AppleColors.background.tertiary,
    borderRadius: AppleBorderRadius.card,
    padding: AppleSpacing.base,
    ...AppleShadows.small,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    fontSize: 24,
    marginRight: AppleSpacing.md,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    ...AppleTypography.body,
    color: AppleColors.label.primary,
    marginBottom: 2,
  },
  reminderSubtitle: {
    ...AppleTypography.footnote,
    color: AppleColors.label.secondary,
  },
  chevron: {
    ...AppleTypography.title2,
    color: AppleColors.label.quaternary,
    fontWeight: '300',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppleColors.systemBlue + '15',
    padding: AppleSpacing.base,
    borderRadius: AppleBorderRadius.card,
    marginTop: AppleSpacing.lg,
  },
  infoEmoji: {
    fontSize: 20,
    marginRight: AppleSpacing.md,
  },
  infoText: {
    ...AppleTypography.footnote,
    color: AppleColors.systemBlue,
    flex: 1,
    lineHeight: 18,
  },
  bottomContainer: {
    padding: AppleSpacing.base,
    backgroundColor: AppleColors.background.secondary,
    borderTopWidth: 0.5,
    borderTopColor: AppleColors.separator.nonOpaque,
  },
});

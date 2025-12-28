import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { AppleButton } from '../components/AppleButton';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../constants/AppleTheme';
import { useHabits } from '../context/HabitContext';

export default function AddHabitScreen() {
    const router = useRouter();
    const { addHabit } = useHabits();
    const [habitName, setHabitName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(AppleColors.systemBlue);
    const [selectedFrequency, setSelectedFrequency] = useState('daily');
    const [habitType, setHabitType] = useState<'build' | 'break'>('build');
    const [isPrivate, setIsPrivate] = useState(false);

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

    const types = [
        { label: 'Build', value: 'build', icon: 'TrendingUp' },
        { label: 'Break', value: 'break', icon: 'ShieldOff' },
    ];

    const handleCreate = async () => {
        const success = await addHabit({
            name: habitName,
            type: habitType,
            icon: habitType === 'build' ? 'Zap' : 'Ban',
            color: selectedColor,
            isPrivate: isPrivate,
            description: description,
            frequency: [selectedFrequency],
        });

        if (success) {
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
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
                    {/* Habit Type */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Type</Text>
                        <View style={styles.typeContainer}>
                            {types.map((type) => {
                                const Icon = (LucideIcons as any)[type.icon];
                                const isSelected = habitType === type.value;
                                return (
                                    <TouchableOpacity
                                        key={type.value}
                                        onPress={() => setHabitType(type.value as any)}
                                        style={[
                                            styles.typeOption,
                                            isSelected && { backgroundColor: type.value === 'build' ? AppleColors.systemGreen : AppleColors.systemOrange },
                                        ]}
                                    >
                                        <Icon size={18} color={isSelected ? 'white' : AppleColors.label.secondary} />
                                        <Text style={[styles.typeText, isSelected && { color: 'white' }]}>{type.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

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

                    {/* Privacy Toggle */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.privacyCard}
                            onPress={() => setIsPrivate(!isPrivate)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.privacyContent}>
                                <LucideIcons.Lock size={20} color={isPrivate ? AppleColors.systemBlue : AppleColors.label.tertiary} />
                                <View style={styles.privacyInfo}>
                                    <Text style={styles.privacyTitle}>Private Habit</Text>
                                    <Text style={styles.privacySubtitle}>Hide this habit behind PIN protection</Text>
                                </View>
                                <View style={[styles.toggle, isPrivate && styles.toggleOn]}>
                                    <View style={[styles.toggleThumb, isPrivate && styles.toggleThumbOn]} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Description (Optional)</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Add a description"
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
                </ScrollView>

                {/* Bottom Actions */}
                <View style={styles.bottomContainer}>
                    <AppleButton
                        title="Create Habit"
                        onPress={handleCreate}
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
    typeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    typeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 16,
        gap: 8,
        ...AppleShadows.small,
    },
    typeText: {
        ...AppleTypography.callout,
        fontWeight: '600',
        color: AppleColors.label.primary,
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
    privacyCard: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: AppleBorderRadius.card,
        padding: AppleSpacing.base,
        ...AppleShadows.small,
    },
    privacyContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    privacyInfo: {
        flex: 1,
        marginLeft: AppleSpacing.md,
    },
    privacyTitle: {
        ...AppleTypography.body,
        fontWeight: '600',
        color: AppleColors.label.primary,
    },
    privacySubtitle: {
        ...AppleTypography.footnote,
        color: AppleColors.label.secondary,
    },
    toggle: {
        width: 51,
        height: 31,
        borderRadius: 16,
        backgroundColor: AppleColors.fill.tertiary,
        padding: 2,
    },
    toggleOn: {
        backgroundColor: AppleColors.systemBlue,
    },
    toggleThumb: {
        width: 27,
        height: 27,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        ...AppleShadows.small,
    },
    toggleThumbOn: {
        transform: [{ translateX: 20 }],
    },
    bottomContainer: {
        padding: AppleSpacing.base,
        backgroundColor: AppleColors.background.secondary,
        borderTopWidth: 0.5,
        borderTopColor: AppleColors.separator.nonOpaque,
    },
});

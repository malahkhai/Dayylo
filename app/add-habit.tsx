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
    const [difficulty, setDifficulty] = useState(5);
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
            difficulty: difficulty,
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

                    {/* Difficulty Selection */}
                    <View style={styles.section}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Difficulty</Text>
                            <View style={[
                                styles.difficultyIndicator,
                                { backgroundColor: (difficulty < 4 ? AppleColors.systemGreen : difficulty > 7 ? AppleColors.systemRed : AppleColors.systemOrange) + '20' }
                            ]}>
                                <Text style={[
                                    styles.difficultyIndicatorText,
                                    { color: difficulty < 4 ? AppleColors.systemGreen : difficulty > 7 ? AppleColors.systemRed : AppleColors.systemOrange }
                                ]}>
                                    {difficulty < 4 ? 'Easy' : difficulty > 7 ? 'Hard' : 'Moderate'} • {difficulty}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.difficultyPicker}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    onPress={() => setDifficulty(d)}
                                    style={[
                                        styles.difficultyNode,
                                        difficulty === d && {
                                            backgroundColor: difficulty < 4 ? AppleColors.systemGreen : difficulty > 7 ? AppleColors.systemRed : AppleColors.systemOrange,
                                            borderColor: 'transparent'
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.difficultyNodeText,
                                        difficulty === d && { color: 'white' }
                                    ]}>{d}</Text>
                                </TouchableOpacity>
                            ))}
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
        backgroundColor: AppleColors.background.primary,
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
        backgroundColor: AppleColors.background.primary,
    },
    cancelButton: {
        ...AppleTypography.body,
        fontWeight: '700',
        color: AppleColors.primary,
    },
    headerTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
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
        marginBottom: 32,
    },
    label: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: AppleColors.label.tertiary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 2,
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
        paddingVertical: 16,
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        ...AppleShadows.small,
    },
    typeText: {
        ...AppleTypography.callout,
        fontWeight: '800',
        color: AppleColors.label.primary,
    },
    inputContainer: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        ...AppleShadows.small,
    },
    input: {
        ...AppleTypography.body,
        fontWeight: '600',
        color: AppleColors.label.primary,
        padding: 20,
    },
    textAreaContainer: {
        minHeight: 120,
    },
    textArea: {
        minHeight: 100,
    },
    colorGrid: {
        flexDirection: 'row',
        gap: 16,
        paddingVertical: 4,
    },
    colorOption: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        ...AppleShadows.medium,
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    colorCheckmark: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '900',
    },
    privacyCard: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
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
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    privacySubtitle: {
        ...AppleTypography.footnote,
        fontWeight: '600',
        color: AppleColors.label.tertiary,
    },
    toggle: {
        width: 51,
        height: 31,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 2,
    },
    toggleOn: {
        backgroundColor: AppleColors.primary,
    },
    toggleThumb: {
        width: 27,
        height: 27,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
    },
    toggleThumbOn: {
        transform: [{ translateX: 20 }],
    },
    bottomContainer: {
        padding: AppleSpacing.lg,
        paddingBottom: AppleSpacing.xxl,
        backgroundColor: AppleColors.background.primary,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    difficultyIndicator: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    difficultyIndicatorText: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    difficultyPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: AppleColors.background.tertiary,
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    difficultyNode: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    difficultyNodeText: {
        ...AppleTypography.footnote,
        fontWeight: '900',
        color: AppleColors.label.secondary,
    },
});

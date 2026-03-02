import React, { useState } from 'react';
import {
    View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius } from '../constants/AppleTheme';
import { useHabits } from '../context/HabitContext';

// ─── Available icons ──────────────────────────────────────────────────────────

const AVAILABLE_ICONS = [
    'Droplet', 'Leaf', 'Dumbbell', 'BookOpen', 'Ban', 'Zap', 'Heart', 'Star',
    'Sun', 'Moon', 'Coffee', 'Apple', 'Bike', 'Music', 'Pencil', 'Smile',
    'Flame', 'TrendingUp', 'Shield', 'Target', 'Bell', 'Clock', 'Cpu', 'Eye',
];

// ─── Difficulty options ───────────────────────────────────────────────────────

const DIFFICULTIES: { label: string; value: 'easy' | 'medium' | 'hard'; color: string }[] = [
    { label: 'Easy', value: 'easy', color: AppleColors.systemGreen },
    { label: 'Medium', value: 'medium', color: AppleColors.systemOrange },
    { label: 'Hard', value: 'hard', color: AppleColors.systemRed },
];

// ─── Day abbreviations ────────────────────────────────────────────────────────

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AddHabitScreen() {
    const router = useRouter();
    const { editId } = useLocalSearchParams<{ editId: string }>();
    const { habits, addHabit, editHabit } = useHabits();

    const [habitName, setHabitName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(AppleColors.systemBlue);
    const [selectedIcon, setSelectedIcon] = useState('Zap');
    const [habitType, setHabitType] = useState<'build' | 'break'>('build');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [isPrivate, setIsPrivate] = useState(false);
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // all days
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [reminderTime, setReminderTime] = useState(''); // simple text like '08:00'

    React.useEffect(() => {
        if (editId) {
            const h = habits.find(habit => habit.id === editId);
            if (h) {
                setHabitName(h.name);
                setDescription(h.description || '');
                setSelectedColor(h.color);
                setSelectedIcon(h.icon);
                setHabitType(h.type || 'build');
                setDifficulty((h as any).difficulty || 'medium');
                setIsPrivate(h.isPrivate || false);
                setReminderTime((h as any).reminderTime || '');
                if (h.frequency && typeof h.frequency !== 'string') {
                    const daysArr = (h.frequency as string[]).map(d => DAY_LABELS.indexOf(d)).filter(i => i !== -1);
                    if (daysArr.length > 0) setSelectedDays(daysArr);
                }
            }
        }
    }, [editId, habits]);

    const colors = [
        AppleColors.systemBlue, AppleColors.systemPurple, '#f97316',
        AppleColors.systemGreen, '#30e8ab', AppleColors.systemRed,
        '#ec4899', '#eab308',
    ];

    const toggleDay = (index: number) => {
        Haptics.selectionAsync();
        setSelectedDays(prev =>
            prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
        );
    };

    const handleCreate = async () => {
        if (!habitName.trim()) {
            Alert.alert("Name required", "Please enter a name for your habit.");
            return;
        }
        if (selectedDays.length === 0) {
            Alert.alert("Select days", "Please select at least one day for tracking.");
            return;
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const habitData = {
            name: habitName.trim(),
            type: habitType,
            icon: selectedIcon,
            color: selectedColor,
            isPrivate,
            description: description.trim(),
            frequency: selectedDays.map(d => DAY_LABELS[d]),
            difficulty,
            reminderTime: reminderTime.trim() || undefined,
        };

        if (editId) {
            await editHabit(editId, habitData);
            router.back();
        } else {
            const success = await addHabit({
                ...habitData,
                history: {},
            });

            if (success) {
                router.back();
            } else {
                Alert.alert(
                    "Habit Limit Reached",
                    "Free accounts can only have 3 habits. Upgrade to Premium for unlimited habits.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Upgrade", onPress: () => router.push('/paywall') }
                    ]
                );
            }
        }
    };

    const SelectedIcon = (LucideIcons as any)[selectedIcon] || LucideIcons.Zap;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{editId ? 'Edit Habit' : 'New Habit'}</Text>
                    <TouchableOpacity onPress={handleCreate}>
                        <Text style={[styles.cancelButton, { color: selectedColor }]}>{editId ? 'Save' : 'Create'}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Icon + Name preview */}
                    <View style={[styles.previewCard, { backgroundColor: selectedColor + '15', borderColor: selectedColor + '30' }]}>
                        <TouchableOpacity
                            onPress={() => setShowIconPicker(!showIconPicker)}
                            style={[styles.iconPreview, { backgroundColor: selectedColor + '25' }]}
                        >
                            <SelectedIcon size={36} color={selectedColor} />
                            <View style={styles.iconEditBadge}>
                                <LucideIcons.Pencil size={8} color={selectedColor} />
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.previewName, { color: selectedColor }]}>
                            {habitName || 'New Habit'}
                        </Text>
                        <Text style={styles.previewSub}>
                            {habitType === 'build' ? '🌱 Build Habit' : '🛡️ Break Habit'} • {difficulty}
                        </Text>
                    </View>

                    {/* Icon Picker */}
                    {showIconPicker && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Choose Icon</Text>
                            <View style={styles.iconGrid}>
                                {AVAILABLE_ICONS.map(iconName => {
                                    const Icon = (LucideIcons as any)[iconName];
                                    const isSelected = selectedIcon === iconName;
                                    return (
                                        <TouchableOpacity
                                            key={iconName}
                                            onPress={() => { setSelectedIcon(iconName); Haptics.selectionAsync(); }}
                                            style={[
                                                styles.iconCell,
                                                isSelected && { backgroundColor: selectedColor + '25', borderColor: selectedColor },
                                            ]}
                                        >
                                            <Icon size={22} color={isSelected ? selectedColor : AppleColors.label.secondary} />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Type */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Habit Type</Text>
                        <View style={styles.typeContainer}>
                            {[
                                { label: '🌱 Build', value: 'build' as const },
                                { label: '🛡️ Break', value: 'break' as const },
                            ].map(type => (
                                <TouchableOpacity
                                    key={type.value}
                                    onPress={() => { setHabitType(type.value); Haptics.selectionAsync(); }}
                                    style={[
                                        styles.typeOption,
                                        habitType === type.value && { backgroundColor: type.value === 'build' ? AppleColors.systemGreen : AppleColors.systemOrange, borderColor: 'transparent' }
                                    ]}
                                >
                                    <Text style={[styles.typeText, habitType === type.value && { color: 'white', fontWeight: '900' }]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Name */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Habit Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Morning Run"
                            placeholderTextColor={AppleColors.label.tertiary}
                            value={habitName}
                            onChangeText={setHabitName}
                            returnKeyType="next"
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Description (optional)</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            placeholder="Why is this habit important to you?"
                            placeholderTextColor={AppleColors.label.tertiary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                    </View>

                    {/* Color */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Color</Text>
                        <View style={styles.colorGrid}>
                            {colors.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => { setSelectedColor(color); Haptics.selectionAsync(); }}
                                    style={[styles.colorDot, { backgroundColor: color }]}
                                >
                                    {selectedColor === color && (
                                        <LucideIcons.Check size={14} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Frequency Days */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Frequency</Text>
                        <View style={styles.daysRow}>
                            {DAYS.map((day, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => toggleDay(i)}
                                    style={[
                                        styles.dayBtn,
                                        selectedDays.includes(i) && { backgroundColor: selectedColor, borderColor: selectedColor },
                                    ]}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        selectedDays.includes(i) && { color: '#fff', fontWeight: '900' }
                                    ]}>
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.daysHint}>
                            {selectedDays.length === 7 ? 'Every day' :
                                selectedDays.length === 0 ? 'No days selected' :
                                    selectedDays.map(d => DAY_LABELS[d]).join(', ')}
                        </Text>
                    </View>

                    {/* Reminder Time */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Reminder Time (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 08:30 AM"
                            placeholderTextColor={AppleColors.label.tertiary}
                            value={reminderTime}
                            onChangeText={setReminderTime}
                        />
                    </View>

                    {/* Difficulty */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Difficulty</Text>
                        <View style={styles.typeContainer}>
                            {DIFFICULTIES.map(d => (
                                <TouchableOpacity
                                    key={d.value}
                                    onPress={() => { setDifficulty(d.value); Haptics.selectionAsync(); }}
                                    style={[
                                        styles.typeOption,
                                        difficulty === d.value && { backgroundColor: d.color + '25', borderColor: d.color },
                                    ]}
                                >
                                    <Text style={[
                                        styles.typeText,
                                        difficulty === d.value && { color: d.color, fontWeight: '900' }
                                    ]}>
                                        {d.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Privacy Toggle */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            onPress={() => { setIsPrivate(!isPrivate); Haptics.selectionAsync(); }}
                            style={styles.toggleRow}
                        >
                            <View style={styles.toggleLeft}>
                                <LucideIcons.Lock size={20} color={isPrivate ? AppleColors.systemGreen : AppleColors.label.secondary} />
                                <View>
                                    <Text style={styles.toggleLabel}>Private Habit</Text>
                                    <Text style={styles.toggleSub}>Requires biometric unlock to view</Text>
                                </View>
                            </View>
                            <View style={[
                                styles.toggleKnob,
                                isPrivate && { backgroundColor: AppleColors.systemGreen }
                            ]}>
                                <View style={[
                                    styles.knob,
                                    isPrivate && { transform: [{ translateX: 20 }] }
                                ]} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={!habitName.trim()}
                        style={[
                            styles.createButton,
                            { backgroundColor: selectedColor },
                            !habitName.trim() && { opacity: 0.4 }
                        ]}
                    >
                        <LucideIcons.Plus size={20} color="#fff" />
                        <Text style={styles.createButtonText}>{editId ? 'Save Habit' : 'Create Habit'}</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppleColors.background.primary },
    keyboardView: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: AppleSpacing.base, paddingVertical: AppleSpacing.md,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    cancelButton: { ...AppleTypography.body, fontWeight: '600', color: AppleColors.systemBlue },
    headerTitle: { ...AppleTypography.headline, fontWeight: '700', color: AppleColors.label.primary },

    previewCard: {
        margin: AppleSpacing.base, borderRadius: 24, padding: 24,
        alignItems: 'center', borderWidth: 1,
    },
    iconPreview: { width: 80, height: 80, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative' },
    iconEditBadge: {
        position: 'absolute', bottom: -3, right: -3,
        width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center'
    },
    previewName: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
    previewSub: { ...AppleTypography.footnote, color: AppleColors.label.secondary },

    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    section: { marginHorizontal: AppleSpacing.base, marginBottom: AppleSpacing.lg },
    label: {
        ...AppleTypography.footnote, fontWeight: '700', color: AppleColors.label.secondary,
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
    },

    iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    iconCell: {
        width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    },

    typeContainer: { flexDirection: 'row', gap: 10 },
    typeOption: {
        flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    },
    typeText: { ...AppleTypography.callout, color: AppleColors.label.secondary, fontWeight: '600' },

    input: {
        ...AppleTypography.body, color: AppleColors.label.primary, padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },

    colorGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
    colorDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

    daysRow: { flexDirection: 'row', gap: 8 },
    dayBtn: {
        flex: 1, aspectRatio: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    },
    dayText: { fontSize: 12, fontWeight: '700', color: AppleColors.label.secondary },
    daysHint: { ...AppleTypography.caption2, color: AppleColors.label.tertiary, marginTop: 8 },

    toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    toggleLabel: { ...AppleTypography.callout, fontWeight: '600', color: AppleColors.label.primary },
    toggleSub: { ...AppleTypography.caption2, color: AppleColors.label.tertiary, marginTop: 2 },
    toggleKnob: {
        width: 44, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 2,
    },
    knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },

    createButton: {
        marginHorizontal: AppleSpacing.base, padding: 18, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    createButtonText: { ...AppleTypography.headline, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 },
});

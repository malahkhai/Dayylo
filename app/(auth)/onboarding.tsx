import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../../constants/AppleTheme';
import { AppleButton } from '../../components/AppleButton';
import { useHabits } from '../../context/HabitContext';

const { width } = Dimensions.get('window');

interface StarterHabit {
    id: string;
    name: string;
    type: 'build' | 'break';
    icon: keyof typeof LucideIcons;
    color: string;
}

const STARTER_HABITS: StarterHabit[] = [
    { id: 'h1', name: 'Gym', type: 'build', icon: 'Dumbbell', color: AppleColors.systemBlue },
    { id: 'h2', name: 'Water', type: 'build', icon: 'Droplets', color: AppleColors.systemCyan },
    { id: 'h3', name: 'Meditate', type: 'build', icon: 'Zap', color: AppleColors.systemPurple },
    { id: 'h4', name: 'Read', type: 'build', icon: 'BookOpen', color: AppleColors.systemGreen },
    { id: 'h-custom-build', name: 'Custom', type: 'build', icon: 'Plus', color: AppleColors.systemMint },
    { id: 'h5', name: 'Smoking', type: 'break', icon: 'Wind', color: AppleColors.systemRed },
    { id: 'h6', name: 'Social', type: 'break', icon: 'Smartphone', color: AppleColors.systemPink },
    { id: 'h7', name: 'Porn', type: 'break', icon: 'EyeOff', color: AppleColors.systemIndigo },
    { id: 'h8', name: 'Sugar', type: 'break', icon: 'Cookie', color: AppleColors.systemOrange },
    { id: 'h-custom-break', name: 'Custom', type: 'break', icon: 'Plus', color: AppleColors.systemYellow },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { addHabit } = useHabits();
    const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
    const [showPrivacyPrompt, setShowPrivacyPrompt] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const toggleHabit = (id: string) => {
        if (id.includes('custom')) {
            router.push('/add-habit');
            return;
        }

        setSelectedHabits(prev => {
            const isRemoving = prev.includes(id);
            const newState = isRemoving ? prev.filter(h => h !== id) : [...prev, id];

            if (!isRemoving) {
                const habit = STARTER_HABITS.find(h => h.id === id);
                if (habit?.type === 'break' && !prev.some(hid => STARTER_HABITS.find(h => h.id === hid)?.type === 'break')) {
                    setShowPrivacyPrompt(true);
                }
            }
            return newState;
        });
    };

    const handleStartTracking = async () => {
        // Add selected habits to context
        for (const hid of selectedHabits) {
            const h = STARTER_HABITS.find(sh => sh.id === hid);
            if (h) {
                await addHabit({
                    name: h.name,
                    type: h.type,
                    icon: h.icon,
                    color: h.color,
                    isPrivate: h.type === 'break' ? isPrivate : false,
                    frequency: ['daily'],
                });
            }
        }
        router.replace('/(tabs)');
    };

    const renderHabitItem = (h: StarterHabit) => {
        const isSelected = selectedHabits.includes(h.id);
        const isCustom = h.id.includes('custom');
        const Icon = LucideIcons[h.icon] as any;

        return (
            <Pressable
                key={h.id}
                onPress={() => toggleHabit(h.id)}
                style={[
                    styles.habitItem,
                    { backgroundColor: h.color + '08', borderColor: h.color + '20' },
                    isSelected && { backgroundColor: h.color + '20', borderColor: h.color }
                ]}
            >
                <View style={[styles.habitIconBg, { backgroundColor: h.color + '20' }]}>
                    <Icon size={24} color={h.color} />
                </View>
                <Text style={[styles.habitName, isSelected && { color: h.color }]} numberOfLines={1}>{h.name}</Text>

                {!isCustom && (
                    <View style={[styles.checkbox, isSelected && { backgroundColor: h.color, borderColor: h.color }]}>
                        {isSelected && <LucideIcons.Check size={14} color="white" />}
                    </View>
                )}
                {isCustom && (
                    <View style={styles.plusIcon}>
                        <LucideIcons.Plus size={14} color={AppleColors.label.tertiary} />
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Define your path</Text>
                    <Text style={styles.subtitle}>Select the habits you want to track. You can always change this later.</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                    <Text style={styles.sectionTitle}>Build Habits</Text>
                    <View style={styles.grid}>
                        {STARTER_HABITS.filter(h => h.type === 'build').map(renderHabitItem)}
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Break Habits</Text>
                    <View style={styles.grid}>
                        {STARTER_HABITS.filter(h => h.type === 'break').map(renderHabitItem)}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <AppleButton
                        title="Start Tracking"
                        onPress={handleStartTracking}
                        size="large"
                        fullWidth
                    />
                    <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip for now</Text>
                    </Pressable>
                </View>
            </View>

            {/* Privacy Prompt Modal */}
            <Modal
                visible={showPrivacyPrompt}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconBg}>
                            <LucideIcons.Lock size={32} color={AppleColors.systemBlue} />
                        </View>
                        <Text style={styles.modalTitle}>Keep them private?</Text>
                        <Text style={styles.modalText}>
                            Would you like to protect your "Break Habits" with a PIN? They will be hidden from the main view unless unlocked.
                        </Text>
                        <View style={styles.modalActions}>
                            <AppleButton
                                title="Protect Habits"
                                onPress={() => { setIsPrivate(true); setShowPrivacyPrompt(false); }}
                                fullWidth
                                style={{ marginBottom: 12 }}
                            />
                            <Pressable
                                onPress={() => { setIsPrivate(false); setShowPrivacyPrompt(false); }}
                                style={styles.modalCancel}
                            >
                                <Text style={styles.modalCancelText}>No, keep them visible</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: AppleSpacing.base,
    },
    header: {
        marginTop: 40,
        marginBottom: 32,
    },
    title: {
        ...AppleTypography.largeTitle,
        color: AppleColors.label.primary,
        marginBottom: 8,
    },
    subtitle: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
    },
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        ...AppleTypography.headline,
        color: AppleColors.label.primary,
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    habitItem: {
        width: (width - AppleSpacing.base * 2 - 12) / 2,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppleColors.background.tertiary,
        padding: 16,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        ...AppleShadows.small,
    },
    habitIconBg: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    habitName: {
        ...AppleTypography.body,
        fontWeight: '600',
        color: AppleColors.label.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    checkbox: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: AppleColors.separator.opaque,
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    footer: {
        paddingVertical: 24,
    },
    skipButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    skipText: {
        ...AppleTypography.callout,
        color: AppleColors.label.secondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    modalContent: {
        backgroundColor: AppleColors.background.tertiary,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        ...AppleShadows.card,
    },
    modalIconBg: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: AppleColors.systemBlue + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        ...AppleTypography.title2,
        color: AppleColors.label.primary,
        marginBottom: 12,
        textAlign: 'center',
    },
    modalText: {
        ...AppleTypography.body,
        color: AppleColors.label.secondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    modalActions: {
        width: '100%',
    },
    modalCancel: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalCancelText: {
        ...AppleTypography.callout,
        color: AppleColors.label.secondary,
        fontWeight: '600',
    }
});

import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleShadows } from '../constants/AppleTheme';
import { useHabits } from '../context/HabitContext';
import { Analytics } from '../services/analytics';

// ─── Safe Icon Helper ────────────────────────────────────────────────────────
const SafeIcon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Activity;
  try {
    return React.createElement(IconComponent, { size, color });
  } catch (error) {
    console.error(`Error rendering icon ${name}:`, error);
    return <LucideIcons.Activity size={size} color={color} />;
  }
};

const { width } = Dimensions.get('window');

export default function DailyWrapupScreen() {
    const router = useRouter();
    const { habits } = useHabits();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayLabel = yesterday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    React.useEffect(() => {
        Analytics.logEvent('wrapup_viewed', { score, totalHabits });
    }, []);

    const builds = habits.filter(h => h.type === 'build' && !h.isArchived);
    const breaks = habits.filter(h => h.type === 'break' && !h.isArchived);

    // STRICTLY use yesterday's history. No fallback to 'completedToday'.
    const completedBuilds = builds.filter(h => h.history?.[yesterdayStr] === true);
    const avoidedBreaks = breaks.filter(h => h.history?.[yesterdayStr] === true);

    const totalHabits = habits.length;
    const totalCompleted = completedBuilds.length + avoidedBreaks.length;
    const score = totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;
    const scoreEmoji = score >= 85 ? '🏆' : score >= 60 ? '✌️' : '💪';
    const scoreColor = score >= 85 ? '#007AFF' : score >= 60 ? '#FF9500' : AppleColors.systemRed;

    const handleShare = async () => {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            const result = await Share.share({
                message: `I scored ${score}% discipline in Dayylo yesterday! ${scoreEmoji}\n🔥 Streak: ${habits.length} habits tracked. \n\nBuilding a better life, one swipe at a time. #Dayylo #Discipline`,
            });
            if (result.action === Share.sharedAction) {
                Analytics.logEvent('wrapup_shared', { score });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDone = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <LucideIcons.ChevronLeft size={28} color={AppleColors.label.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>Daily Wrap-up</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                    style={styles.summaryCard}
                >
                    <View style={styles.dateLabel}>
                        <Text style={styles.dateText}>PERFORMANCE SUMMARY</Text>
                        <Text style={styles.actualDate}>{yesterdayLabel}</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 16 }}>
                        <Text style={{ fontSize: 48 }}>{scoreEmoji}</Text>
                        <Text style={{ fontSize: 56, fontWeight: '900', color: scoreColor }}>{score}%</Text>
                        <Text style={{ ...AppleTypography.footnote, color: AppleColors.label.secondary, marginTop: 4, fontWeight: '700' }}>DAILY DISCIPLINE SCORE</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{completedBuilds.length}/{builds.length}</Text>
                            <Text style={styles.statLabel}>Builds</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{avoidedBreaks.length}/{breaks.length}</Text>
                            <Text style={styles.statLabel}>Breaks Avoided</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Build Habits</Text>
                </View>

                {builds.map(h => {
                    const wasCompleted = h.history?.[yesterdayStr] === true;
                    const habitColor = '#007AFF'; // Build Blue
                    return (
                        <View key={h.id} style={styles.habitRow}>
                            <View style={[styles.iconBg, { backgroundColor: habitColor + '15' }]}>
                                <SafeIcon name={h.icon} size={20} color={habitColor} />
                            </View>
                            <Text style={styles.habitName}>{h.name}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: wasCompleted ? habitColor + '15' : 'rgba(255,255,255,0.05)' }]}>
                                <Text style={[styles.statusText, { color: wasCompleted ? habitColor : AppleColors.label.tertiary }]}>
                                    {wasCompleted ? 'COMPLETED' : 'MISSED'}
                                </Text>
                            </View>
                        </View>
                    );
                })}

                <View style={[styles.sectionHeader, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitle}>Break Habits</Text>
                </View>

                {breaks.map(h => {
                    const wasAvoided = h.history?.[yesterdayStr] === true;
                    const habitColor = '#FF9500'; // Break Orange
                    return (
                        <View key={h.id} style={styles.habitRow}>
                            <View style={[styles.iconBg, { backgroundColor: habitColor + '15' }]}>
                                <SafeIcon name={h.icon} size={20} color={habitColor} />
                            </View>
                            <Text style={styles.habitName}>{h.name}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: wasAvoided ? AppleColors.systemGreen + '15' : '#FF950015' }]}>
                                <Text style={[styles.statusText, { color: wasAvoided ? AppleColors.systemGreen : '#FF9500' }]}>
                                    {wasAvoided ? 'AVOIDED' : 'FAILED'}
                                </Text>
                            </View>
                        </View>
                    );
                })}

                <View style={styles.footer}>
                    <Text style={styles.footerQuote}>"Every day is a new scroll of history."</Text>
                    <View style={styles.actionRow}>
                        <Pressable
                            style={[styles.actionButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: AppleColors.primary }]}
                            onPress={handleShare}
                        >
                            <LucideIcons.Share size={20} color={AppleColors.primary} />
                            <Text style={[styles.actionButtonText, { color: AppleColors.primary, marginLeft: 8 }]}>Share</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, { backgroundColor: AppleColors.primary, flex: 2 }]}
                            onPress={handleDone}
                        >
                            <Text style={styles.actionButtonText}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppleColors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: AppleSpacing.base,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: AppleColors.label.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: AppleSpacing.base,
    },
    summaryCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 32,
        padding: 24,
        marginTop: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    dateLabel: {
        alignItems: 'center',
        marginBottom: 24,
    },
    dateText: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        color: AppleColors.systemBlue,
        letterSpacing: 1,
        marginBottom: 4,
    },
    actualDate: {
        ...AppleTypography.title2,
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        ...AppleTypography.largeTitle,
        fontWeight: '900',
        color: AppleColors.label.primary,
    },
    statLabel: {
        ...AppleTypography.caption2,
        fontWeight: '800',
        color: AppleColors.label.secondary,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: AppleColors.label.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 11,
    },
    habitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    habitName: {
        ...AppleTypography.body,
        fontWeight: '900',
        color: AppleColors.label.primary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        ...AppleTypography.caption2,
        fontWeight: '900',
        fontSize: 10,
    },
    footer: {
        marginTop: 48,
        marginBottom: 60,
        alignItems: 'center',
    },
    footerQuote: {
        ...AppleTypography.body,
        color: AppleColors.label.tertiary,
        fontStyle: 'italic',
        marginBottom: 32,
        textAlign: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        ...AppleShadows.medium,
    },
    actionButtonText: {
        ...AppleTypography.headline,
        fontWeight: '900',
        color: '#FFFFFF',
    }
});

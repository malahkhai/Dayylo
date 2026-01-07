import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucideIcons from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '../context/HabitContext';
import { AppleColors, AppleTypography, AppleShadows } from '../constants/AppleTheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PaywallScreen() {
    const router = useRouter();
    const { setPremium } = useHabits();
    const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

    const handleSubscribe = async () => {
        // Mock purchase
        await setPremium(true);
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <LinearGradient
                colors={['#000000', '#1a1a1a', '#000000']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header / Dismiss */}
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.closeButton}>
                            <LucideIcons.X size={24} color="white" opacity={0.6} />
                        </Pressable>
                    </View>

                    {/* Illustration */}
                    <View style={styles.illustrationContainer}>
                        <Image
                            source={require('../assets/images/paywall_illustration.png')}
                            style={styles.illustration}
                            resizeMode="contain"
                        />
                        <View style={styles.headingContainer}>
                            <Text style={styles.title}>Unlock <Text style={{ color: AppleColors.systemBlue }}>Pro</Text></Text>
                            <Text style={styles.subtitle}>Supercharge your habits.</Text>
                        </View>
                    </View>

                    {/* Feature Ticks */}
                    <View style={styles.featuresRow}>
                        {['Unlimited Habits', 'Advanced Charts', 'Privacy Lock'].map((feat, i) => (
                            <View key={i} style={styles.featureItem}>
                                <LucideIcons.CheckCircle2 size={14} color={AppleColors.systemBlue} />
                                <Text style={styles.featureText}>{feat}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Pricing Cards */}
                    <View style={styles.cardsContainer}>
                        {/* Annual Card */}
                        <Pressable
                            onPress={() => setSelectedPlan('annual')}
                            style={[
                                styles.planCard,
                                selectedPlan === 'annual' && styles.selectedCard
                            ]}
                        >
                            {selectedPlan === 'annual' && (
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>BEST VALUE</Text>
                                </View>
                            )}
                            <View style={styles.planHeader}>
                                <Text style={styles.planTitle}>Annual</Text>
                                {selectedPlan === 'annual' && <LucideIcons.CheckCircle2 size={20} color={AppleColors.systemBlue} fill="black" />}
                            </View>
                            <Text style={styles.planPrice}>$29.99<Text style={styles.planPeriod}>/year</Text></Text>
                            <Text style={styles.planTrial}>7 Days Free Trial</Text>
                            <Text style={styles.planSavings}>Save 40%</Text>
                        </Pressable>

                        {/* Monthly Card */}
                        <Pressable
                            onPress={() => setSelectedPlan('monthly')}
                            style={[
                                styles.planCard,
                                selectedPlan === 'monthly' && styles.selectedCard
                            ]}
                        >
                            <View style={styles.planHeader}>
                                <Text style={styles.planTitle}>Monthly</Text>
                                {selectedPlan === 'monthly' && <LucideIcons.CheckCircle2 size={20} color={AppleColors.systemBlue} />}
                            </View>
                            <Text style={styles.planPrice}>$4.99<Text style={styles.planPeriod}>/mo</Text></Text>
                            <Text style={styles.planTrial}>No trial</Text>
                        </Pressable>
                    </View>

                    {/* CTA Button */}
                    <Pressable onPress={handleSubscribe} style={styles.ctaButton}>
                        <LinearGradient
                            colors={['#30e8ab', '#059669']} // AppleTheme Primary Gradient-ish
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <Text style={styles.ctaText}>
                            {selectedPlan === 'annual' ? 'Start Free Trial' : 'Subscribe Now'}
                        </Text>
                        <Text style={styles.ctaSubtext}>
                            {selectedPlan === 'annual' ? '7 days free, then $29.99/year' : '$4.99/month, cancel anytime'}
                        </Text>
                    </Pressable>

                    <Text style={styles.disclaimer}>
                        Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                    </Text>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    closeButton: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    illustration: {
        width: width * 0.7,
        height: width * 0.7,
    },
    headingContainer: {
        alignItems: 'center',
        marginTop: -20,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
        fontWeight: '600',
    },
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    featureText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '700',
    },
    cardsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 30,
    },
    planCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: AppleColors.systemBlue,
        backgroundColor: 'rgba(48, 232, 171, 0.05)', // Subtle tint
    },
    badgeContainer: {
        position: 'absolute',
        top: -12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    badgeText: {
        backgroundColor: AppleColors.systemBlue,
        color: 'black',
        fontSize: 10,
        fontWeight: '900',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        overflow: 'hidden',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    planTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
    },
    planPrice: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white',
    },
    planPeriod: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
    },
    planTrial: {
        fontSize: 12,
        color: AppleColors.systemBlue,
        fontWeight: '700',
        marginTop: 4,
    },
    planSavings: {
        fontSize: 11,
        color: '#f59e0b', // Amber/Orange
        fontWeight: '700',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    ctaButton: {
        marginHorizontal: 20,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    ctaText: {
        fontSize: 20,
        fontWeight: '900',
        color: 'black',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    ctaSubtext: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(0,0,0,0.6)',
        marginTop: 2,
    },
    disclaimer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        paddingHorizontal: 40,
        lineHeight: 14,
    },
});

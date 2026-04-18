import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const GREEN = '#3dbf6e';
const GREEN_LIGHT = '#e8f8ef';
const ORANGE = '#f5a623';
const GRAY_BG = '#f5f5f5';
const GRAY_BAR = '#e0e0e0';
const YELLOW_BG = '#fff9e6';

const mockAccount = {
  name: 'My salary account',
  bank: 'Danske Bank',
  balance: '+13,852 kr',
};

const mockChallenge = {
  month: 'April',
  remaining: '4,450 kr',
  total: '10,000 kr',
  periods: [
    { label: '1 Apr – 11 Apr', spent: 2000, budget: 3333, status: 'ok' },
    { label: '12 Apr – 21 Apr', spent: 3500, budget: 3333, status: 'over' },
    { label: '22 Apr – 30 Apr', spent: 50, budget: 3333, status: 'ok' },
  ],
};

const mockInsights = [
  {
    id: '1',
    icon: '👜',
    category: 'Salary',
    date: '18 April',
    message: "It's payday! 18,346 kr has been deposited into your account 💰",
    bg: '#fff',
    accentAmount: '18,346 kr',
  },
  {
    id: '2',
    icon: '📅',
    category: 'Week 16',
    date: '18 April',
    message: "You've spent 1,240 kr on food & drinks this week — 15% less than last week.",
    bg: YELLOW_BG,
    accentAmount: null,
  },
  {
    id: '3',
    icon: '📊',
    category: 'Monthly summary',
    date: '1 April',
    message: "You saved 2,100 kr last month. That's your best month this year!",
    bg: GREEN_LIGHT,
    accentAmount: '2,100 kr',
  },
];

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(value / max, 1);
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

function formatKr(n: number) {
  return n.toLocaleString('en-US').replace(/,/g, '.') + ' kr';
}

function InsightMessage({ message, accent }: { message: string; accent: string | null }) {
  if (!accent) return <Text style={styles.insightMessage}>{message}</Text>;
  const parts = message.split(accent);
  return (
    <Text style={styles.insightMessage}>
      {parts[0]}
      <Text style={styles.insightAccent}>{accent}</Text>
      {parts[1]}
    </Text>
  );
}

export default function AssistantScreen() {
  const overallSpent = mockChallenge.periods.reduce((sum, p) => sum + p.spent, 0);
  const overallBudget = mockChallenge.periods.reduce((sum, p) => sum + p.budget, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Account pill */}
      <View style={styles.accountPill}>
        <View>
          <Text style={styles.accountName}>{mockAccount.name}</Text>
          <Text style={styles.accountBank}>{mockAccount.bank}</Text>
        </View>
        <Text style={styles.accountBalance}>{mockAccount.balance}</Text>
      </View>

      {/* Challenge card */}
      <View style={styles.card}>
        <Text style={styles.cardMonth}>{mockChallenge.month}</Text>
        <Text style={styles.challengeAmount}>{mockChallenge.remaining}</Text>
        <Text style={styles.challengeSub}>
          Remaining of your{' '}
          <Text style={styles.bold}>{mockChallenge.total} Challenge</Text>
        </Text>

        <View style={styles.overallBarRow}>
          <ProgressBar value={overallSpent} max={overallBudget} color={GREEN} />
        </View>

        {mockChallenge.periods.map((p) => {
          const isOver = p.status === 'over';
          const color = isOver ? ORANGE : GREEN;
          return (
            <View key={p.label} style={styles.periodRow}>
              <Text style={styles.periodLabel}>{p.label}</Text>
              <View style={styles.periodBarWrap}>
                <ProgressBar value={p.spent} max={p.budget} color={color} />
              </View>
              <Text style={[styles.periodAmount, isOver && styles.periodAmountOver]}>
                {formatKr(p.spent)}/{formatKr(p.budget)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Insights */}
      <Text style={styles.sectionTitle}>Insights</Text>

      {mockInsights.map((insight) => (
        <View key={insight.id} style={[styles.insightCard, { backgroundColor: insight.bg }]}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>{insight.icon}</Text>
            <View style={styles.insightMeta}>
              <Text style={styles.insightCategory}>{insight.category}</Text>
              <Text style={styles.insightDate}>{insight.date}</Text>
            </View>
          </View>
          <InsightMessage message={insight.message} accent={insight.accentAmount} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GRAY_BG,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },

  // Account pill
  accountPill: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  accountBank: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  accountBalance: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Challenge card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardMonth: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  challengeAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: GREEN,
    marginBottom: 2,
  },
  challengeSub: {
    fontSize: 13,
    color: '#555',
    marginBottom: 12,
  },
  bold: {
    fontWeight: '700',
    color: '#222',
  },
  overallBarRow: {
    marginBottom: 14,
  },
  barTrack: {
    height: 8,
    backgroundColor: GRAY_BAR,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  periodLabel: {
    fontSize: 12,
    color: '#444',
    width: 110,
  },
  periodBarWrap: {
    flex: 1,
  },
  periodAmount: {
    fontSize: 11,
    color: '#444',
    textAlign: 'right',
    width: 90,
  },
  periodAmountOver: {
    color: ORANGE,
  },

  // Insights
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  insightCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  insightIcon: {
    fontSize: 22,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightCategory: {
    fontWeight: '600',
    fontSize: 13,
    color: '#333',
  },
  insightDate: {
    fontSize: 12,
    color: '#999',
  },
  insightMessage: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    lineHeight: 22,
  },
  insightAccent: {
    color: GREEN,
  },
});

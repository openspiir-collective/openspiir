import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GREEN = '#3dbf6e';
const GREEN_MUTED = '#b2e6c8';
const ORANGE = '#f5a623';
const ORANGE_MUTED = '#f5d99a';

const mockSummary = {
  income: 10016,
  incomeAvg: 10000,
  expenses: 13234,
  expensesAvg: 12252,
};

const monthlyData = [
  { month: 'APR', income: 9800, expenses: 12000 },
  { month: 'MAJ', income: 10200, expenses: 13100 },
  { month: 'JUN', income: 9500, expenses: 8500 },
  { month: 'JUL', income: 10100, expenses: 11200 },
  { month: 'AUG', income: 10050, expenses: 12800 },
  { month: 'SEP', income: 10016, expenses: 13234 },
];

const mockAccounts = [
  { id: '1', name: 'Lønkonto', bank: 'Danske Bank', balance: 3852, type: 'card' },
  { id: '2', name: 'Budgetkonto', bank: 'Nordea', balance: 1950, type: 'card' },
  { id: '3', name: 'Opsparing', bank: 'Danske Bank', balance: 15852, type: 'savings' },
];

const TABS = ['Konti', 'Kategorier', 'Poster'] as const;
type Tab = (typeof TABS)[number];

const CHART_MAX_HEIGHT = 60;

function formatDKK(n: number) {
  return n.toLocaleString('da-DK');
}

// ── Bar chart ──────────────────────────────────────────────────────────────

function BarChart() {
  const maxVal = Math.max(...monthlyData.flatMap((d) => [d.income, d.expenses]));
  const currentIdx = monthlyData.length - 1;

  return (
    <View style={chartStyles.container}>
      {monthlyData.map((d, i) => {
        const isCurrent = i === currentIdx;
        const incomeH = Math.max((d.income / maxVal) * CHART_MAX_HEIGHT, 4);
        const expenseH = Math.max((d.expenses / maxVal) * CHART_MAX_HEIGHT, 4);
        return (
          <View key={d.month} style={chartStyles.col}>
            <View style={chartStyles.barsRow}>
              <View
                style={[
                  chartStyles.bar,
                  { height: incomeH, backgroundColor: isCurrent ? GREEN : GREEN_MUTED },
                ]}
              />
              <View
                style={[
                  chartStyles.bar,
                  { height: expenseH, backgroundColor: isCurrent ? ORANGE : ORANGE_MUTED },
                ]}
              />
            </View>
            <Text style={[chartStyles.label, isCurrent && chartStyles.labelCurrent]}>
              {d.month}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: CHART_MAX_HEIGHT,
    marginBottom: 6,
  },
  bar: {
    width: 11,
    borderRadius: 4,
  },
  label: {
    fontSize: 9,
    color: '#bbb',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  labelCurrent: {
    color: '#333',
    fontWeight: '700',
  },
});

// ── Account row icon ───────────────────────────────────────────────────────

function CardIcon() {
  return (
    <View style={iconStyles.wrap}>
      <View style={iconStyles.card}>
        <View style={iconStyles.stripe} />
        <View style={iconStyles.lines}>
          <View style={iconStyles.line} />
          <View style={iconStyles.line} />
        </View>
      </View>
    </View>
  );
}

function SavingsIcon() {
  return (
    <View style={[iconStyles.wrap, iconStyles.savingsWrap]}>
      <Text style={iconStyles.savingsEmoji}>🐷</Text>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  wrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fdf3e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsWrap: {
    backgroundColor: '#e8f8ef',
  },
  card: {
    width: 22,
    height: 16,
    backgroundColor: '#f5c66a',
    borderRadius: 3,
    overflow: 'hidden',
    paddingHorizontal: 3,
    paddingBottom: 3,
  },
  stripe: {
    height: 5,
    backgroundColor: '#e0a030',
    marginHorizontal: -3,
    marginBottom: 3,
  },
  lines: {
    gap: 2,
  },
  line: {
    height: 2,
    width: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 1,
  },
  savingsEmoji: {
    fontSize: 20,
  },
});

// ── Filter sliders icon ────────────────────────────────────────────────────

function SlidersIcon() {
  return (
    <View style={sliderStyles.container}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={sliderStyles.row}>
          <View style={sliderStyles.line} />
          <View style={[sliderStyles.knob, i === 1 && sliderStyles.knobRight]} />
          <View style={sliderStyles.line} />
        </View>
      ))}
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    gap: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 16,
    gap: 0,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  knob: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#333',
    marginHorizontal: 0,
    // default knob at 1/3 from left — override per row
    position: 'absolute',
    left: 4,
  },
  knobRight: {
    left: 9,
  },
});

// ── Main screen ────────────────────────────────────────────────────────────

export default function OverviewScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Konti');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Overblik</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <SlidersIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Income / Expenses summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Indkomst</Text>
          <Text style={[styles.summaryAmount, { color: GREEN }]}>+{formatDKK(mockSummary.income)}</Text>
          <Text style={styles.summaryAvg}>Gns: +{formatDKK(mockSummary.incomeAvg)}</Text>
        </View>
        <View style={[styles.summaryBlock, styles.summaryRight]}>
          <Text style={styles.summaryLabel}>Udgifter</Text>
          <Text style={[styles.summaryAmount, { color: ORANGE }]}>-{formatDKK(mockSummary.expenses)}</Text>
          <Text style={styles.summaryAvg}>Gns: -{formatDKK(mockSummary.expensesAvg)}</Text>
        </View>
      </View>

      {/* Bar chart */}
      <View style={styles.chartWrap}>
        <BarChart />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Account list */}
      {activeTab === 'Konti' && (
        <View style={styles.accountList}>
          {mockAccounts.map((account, idx) => (
            <View
              key={account.id}
              style={[styles.accountRow, idx < mockAccounts.length - 1 && styles.accountRowDivider]}
            >
              {account.type === 'savings' ? <SavingsIcon /> : <CardIcon />}
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountBank}>{account.bank}</Text>
              </View>
              <Text style={styles.accountBalance}>+{formatDKK(account.balance)} kr</Text>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'Kategorier' && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Kategorier kommer snart</Text>
        </View>
      )}

      {activeTab === 'Poster' && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Poster kommer snart</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBlock: {
    gap: 2,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  summaryAvg: {
    fontSize: 11,
    color: '#aaa',
  },

  // Chart
  chartWrap: {
    marginBottom: 20,
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#111',
    fontWeight: '700',
  },

  // Accounts
  accountList: {
    gap: 0,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  accountRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  accountBank: {
    fontSize: 12,
    color: '#999',
  },
  accountBalance: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  // Empty states
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#bbb',
  },
});

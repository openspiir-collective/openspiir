import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const GREEN = '#3dbf6e';
const ORANGE = '#f5a623';

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
    bg: '#fff9e6',
    accentAmount: null,
  },
  {
    id: '3',
    icon: '📊',
    category: 'Monthly summary',
    date: '1 April',
    message: "You saved 2,100 kr last month. That's your best month this year!",
    bg: '#e8f8ef',
    accentAmount: '2,100 kr',
  },
];

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(value / max, 1);
  return (
    <View className="h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
      <View
        className="h-full rounded-full"
        style={{ width: `${pct * 100}%`, backgroundColor: color }}
      />
    </View>
  );
}

function formatKr(n: number) {
  return n.toLocaleString('en-US').replace(/,/g, '.') + ' kr';
}

function InsightMessage({ message, accent }: { message: string; accent: string | null }) {
  if (!accent) {
    return (
      <Text className="text-[15px] font-bold text-[#111] leading-[22px]">{message}</Text>
    );
  }
  const parts = message.split(accent);
  return (
    <Text className="text-[15px] font-bold text-[#111] leading-[22px]">
      {parts[0]}
      <Text className="text-[#3dbf6e]">{accent}</Text>
      {parts[1]}
    </Text>
  );
}

export default function AssistantScreen() {
  const overallSpent = mockChallenge.periods.reduce((sum, p) => sum + p.spent, 0);
  const overallBudget = mockChallenge.periods.reduce((sum, p) => sum + p.budget, 0);

  return (
    <ScrollView className="flex-1 bg-[#f5f5f5]" contentContainerClassName="p-4 pb-8">
      {/* Account pill */}
      <View className="bg-[#3dbf6e] rounded-xl px-4 py-3 flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-white font-semibold text-sm">{mockAccount.name}</Text>
          <Text className="text-white/80 text-xs">{mockAccount.bank}</Text>
        </View>
        <Text className="text-white font-bold text-base">{mockAccount.balance}</Text>
      </View>

      {/* Challenge card */}
      <View className="bg-white rounded-[14px] p-4 mb-5 shadow-sm">
        <Text className="text-lg font-bold mb-1.5">{mockChallenge.month}</Text>
        <Text className="text-[28px] font-bold text-[#3dbf6e] mb-0.5">{mockChallenge.remaining}</Text>
        <Text className="text-[13px] text-[#555] mb-3">
          Remaining of your{' '}
          <Text className="font-bold text-[#222]">{mockChallenge.total} Challenge</Text>
        </Text>

        <View className="mb-[14px]">
          <ProgressBar value={overallSpent} max={overallBudget} color={GREEN} />
        </View>

        {mockChallenge.periods.map((p) => {
          const isOver = p.status === 'over';
          const color = isOver ? ORANGE : GREEN;
          return (
            <View key={p.label} className="flex-row items-center mb-[10px] gap-2">
              <Text className="text-xs text-[#444] w-[110px]">{p.label}</Text>
              <View className="flex-1">
                <ProgressBar value={p.spent} max={p.budget} color={color} />
              </View>
              <Text className={`text-[11px] text-right w-[90px] ${isOver ? 'text-[#f5a623]' : 'text-[#444]'}`}>
                {formatKr(p.spent)}/{formatKr(p.budget)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Insights */}
      <Text className="text-lg font-bold mb-3">Insights</Text>

      {mockInsights.map((insight) => (
        <View
          key={insight.id}
          className="rounded-[14px] p-4 mb-3 shadow-sm"
          style={{ backgroundColor: insight.bg }}
        >
          <View className="flex-row items-center mb-[10px] gap-[10px]">
            <Text className="text-[22px]">{insight.icon}</Text>
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-[13px] text-[#333]">{insight.category}</Text>
              <Text className="text-xs text-[#999]">{insight.date}</Text>
            </View>
          </View>
          <InsightMessage message={insight.message} accent={insight.accentAmount} />
        </View>
      ))}
    </ScrollView>
  );
}

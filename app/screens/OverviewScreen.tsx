import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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

function BarChart() {
  const maxVal = Math.max(...monthlyData.flatMap((d) => [d.income, d.expenses]));
  const currentIdx = monthlyData.length - 1;

  return (
    <View className="flex-row items-end justify-between">
      {monthlyData.map((d, i) => {
        const isCurrent = i === currentIdx;
        const incomeH = Math.max((d.income / maxVal) * CHART_MAX_HEIGHT, 4);
        const expenseH = Math.max((d.expenses / maxVal) * CHART_MAX_HEIGHT, 4);
        return (
          <View key={d.month} className="flex-1 items-center">
            <View className="flex-row items-end gap-[3px] mb-[6px]" style={{ height: CHART_MAX_HEIGHT }}>
              <View
                className="w-[11px] rounded"
                style={{ height: incomeH, backgroundColor: isCurrent ? GREEN : GREEN_MUTED }}
              />
              <View
                className="w-[11px] rounded"
                style={{ height: expenseH, backgroundColor: isCurrent ? ORANGE : ORANGE_MUTED }}
              />
            </View>
            <Text className={`text-[9px] tracking-[0.2px] ${isCurrent ? 'text-[#333] font-bold' : 'text-[#bbb] font-medium'}`}>
              {d.month}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function CardIcon() {
  return (
    <View className="w-[38px] h-[38px] rounded-[10px] bg-[#fdf3e0] items-center justify-center">
      <View className="w-[22px] h-[16px] bg-[#f5c66a] rounded-[3px] overflow-hidden px-[3px] pb-[3px]">
        <View className="h-[5px] bg-[#e0a030] -mx-[3px] mb-[3px]" />
        <View className="gap-[2px]">
          <View className="h-[2px] w-[10px] bg-black/[0.18] rounded-[1px]" />
          <View className="h-[2px] w-[10px] bg-black/[0.18] rounded-[1px]" />
        </View>
      </View>
    </View>
  );
}

function SavingsIcon() {
  return (
    <View className="w-[38px] h-[38px] rounded-[10px] bg-[#e8f8ef] items-center justify-center">
      <Text className="text-[20px]">🐷</Text>
    </View>
  );
}

function SlidersIcon() {
  return (
    <View className="gap-[3px] justify-center items-center">
      {[0, 1, 2].map((i) => (
        <View key={i} className="flex-row items-center w-[16px]">
          <View className="flex-1 h-[1.5px] bg-[#333] rounded" />
          <View
            className="w-[5px] h-[5px] rounded-[3px] bg-[#333] absolute"
            style={{ left: i === 1 ? 9 : 4 }}
          />
          <View className="flex-1 h-[1.5px] bg-[#333] rounded" />
        </View>
      ))}
    </View>
  );
}

export default function OverviewScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Konti');

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="p-5 pb-9"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-[26px] font-extrabold text-[#111] tracking-[-0.5px]">Overblik</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-[38px] h-[38px] rounded-[19px] bg-[#f2f2f2] items-center justify-center">
            <Text className="text-base">🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-[38px] h-[38px] rounded-[19px] bg-[#f2f2f2] items-center justify-center">
            <SlidersIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Income / Expenses summary */}
      <View className="flex-row justify-between mb-5">
        <View className="gap-[2px]">
          <Text className="text-xs text-[#888] font-medium">Indkomst</Text>
          <Text className="text-[22px] font-bold tracking-[-0.5px] text-[#3dbf6e]">+{formatDKK(mockSummary.income)}</Text>
          <Text className="text-[11px] text-[#aaa]">Gns: +{formatDKK(mockSummary.incomeAvg)}</Text>
        </View>
        <View className="gap-[2px] items-end">
          <Text className="text-xs text-[#888] font-medium">Udgifter</Text>
          <Text className="text-[22px] font-bold tracking-[-0.5px] text-[#f5a623]">-{formatDKK(mockSummary.expenses)}</Text>
          <Text className="text-[11px] text-[#aaa]">Gns: -{formatDKK(mockSummary.expensesAvg)}</Text>
        </View>
      </View>

      {/* Bar chart */}
      <View className="mb-5">
        <BarChart />
      </View>

      {/* Tabs */}
      <View className="flex-row bg-[#f2f2f2] rounded-[10px] p-[3px] mb-4">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-[7px] rounded-lg items-center ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-[13px] ${activeTab === tab ? 'text-[#111] font-bold' : 'text-[#888] font-medium'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Account list */}
      {activeTab === 'Konti' && (
        <View>
          {mockAccounts.map((account, idx) => (
            <View
              key={account.id}
              className={`flex-row items-center py-[14px] gap-3 ${idx < mockAccounts.length - 1 ? 'border-b border-[#eee]' : ''}`}
            >
              {account.type === 'savings' ? <SavingsIcon /> : <CardIcon />}
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-[#111] mb-[2px]">{account.name}</Text>
                <Text className="text-xs text-[#999]">{account.bank}</Text>
              </View>
              <Text className="text-[15px] font-bold text-[#111]">+{formatDKK(account.balance)} kr</Text>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'Kategorier' && (
        <View className="py-10 items-center">
          <Text className="text-sm text-[#bbb]">Kategorier kommer snart</Text>
        </View>
      )}

      {activeTab === 'Poster' && (
        <View className="py-10 items-center">
          <Text className="text-sm text-[#bbb]">Poster kommer snart</Text>
        </View>
      )}
    </ScrollView>
  );
}

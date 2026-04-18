import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const mockWeekly = [
  { id: '1', icon: '🥤', title: 'Nej taco til fastfood & takeaway 🌮', spent: 50, budget: 200 },
];

const mockMonthly = [
  { id: '2', icon: '🥕', title: 'Giv madkontoen lidt kærlighed ❤️', spent: 545, budget: 1000 },
  { id: '3', icon: '👕', title: 'Tid til non-shopping februar? 🛍️', spent: 650, budget: 400 },
];

function getColor(spent: number, budget: number) {
  if (spent > budget) return '#e84040';
  if (spent / budget > 0.8) return '#f5a623';
  return '#3dbf6e';
}

function RingIcon({ icon, spent, budget }: { icon: string; spent: number; budget: number }) {
  const color = getColor(spent, budget);
  const size = 52;
  const border = 4;
  const pct = Math.min(spent / budget, 1);

  // Two-semicircle technique for arc progress
  const firstDeg = pct <= 0.5 ? pct * 360 - 180 : 0;
  const secondDeg = pct > 0.5 ? (pct - 0.5) * 360 - 180 : -180;

  return (
    <View style={{ width: size, height: size }}>
      {/* Grey background ring */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: border,
          borderColor: '#e0e0e0',
        }}
      />

      {/* First half (0–50%) */}
      <View
        style={{
          position: 'absolute',
          width: size / 2,
          height: size,
          left: size / 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: border,
            borderColor: pct > 0 ? color : 'transparent',
            position: 'absolute',
            left: -size / 2,
            transform: [{ rotate: `${firstDeg}deg` }],
          }}
        />
      </View>

      {/* Second half (50–100%) */}
      {pct > 0.5 && (
        <View
          style={{
            position: 'absolute',
            width: size / 2,
            height: size,
            left: 0,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: border,
              borderColor: color,
              position: 'absolute',
              left: 0,
              transform: [{ rotate: `${secondDeg}deg` }],
            }}
          />
        </View>
      )}

      {/* Center icon */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
    </View>
  );
}

function ChallengeCard({
  icon,
  title,
  spent,
  budget,
}: {
  icon: string;
  title: string;
  spent: number;
  budget: number;
}) {
  const color = getColor(spent, budget);
  const isOver = spent > budget;
  const diff = Math.abs(budget - spent);

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 flex-row items-center gap-4">
      <RingIcon icon={icon} spent={spent} budget={budget} />
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-[#111] mb-0.5">{title}</Text>
        <Text className="text-[15px] font-bold mb-0.5" style={{ color }}>
          {spent} / {budget}
        </Text>
        <Text className="text-xs text-[#999]">
          {diff} kr {isOver ? 'over' : 'tilbage'}
        </Text>
      </View>
    </View>
  );
}

export default function ChallengesScreen() {
  const [tab, setTab] = useState<'mine' | 'aktive'>('mine');

  return (
    <ScrollView className="flex-1 bg-[#f2f2f2]" contentContainerClassName="p-4 pb-8">
      <View className="bg-white rounded-2xl p-4">
        <Text className="text-xl font-bold text-[#111] mb-3">Challenges</Text>

        {/* Tabs */}
        <View className="flex-row gap-2 mb-5">
          {(['mine', 'aktive'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full border ${
                tab === t ? 'border-[#111] bg-white' : 'border-transparent'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  tab === t ? 'text-[#111]' : 'text-[#999]'
                }`}
              >
                {t === 'mine' ? 'Mine challenges' : 'Aktive challenges'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'mine' && (
          <>
            <Text className="text-base font-bold text-[#111] mb-2">Ugentlige</Text>
            {mockWeekly.map((c) => (
              <ChallengeCard key={c.id} {...c} />
            ))}

            <Text className="text-base font-bold text-[#111] mt-2 mb-2">Månedlige</Text>
            {mockMonthly.map((c) => (
              <ChallengeCard key={c.id} {...c} />
            ))}
          </>
        )}

        {tab === 'aktive' && (
          <Text className="text-sm text-[#999]">Ingen aktive challenges.</Text>
        )}
      </View>
    </ScrollView>
  );
}

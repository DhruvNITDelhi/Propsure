import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/theme';

type TabIconName = 'home' | 'home-outline' | 'shield-check' | 'shield-check-outline' |
  'map-search' | 'map-search-outline' | 'file-document-edit' | 'file-document-edit-outline' |
  'dots-horizontal-circle' | 'dots-horizontal-circle-outline';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline' as TabIconName}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="rera/index"
          options={{
            title: 'RERA',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'shield-check' : 'shield-check-outline' as TabIconName}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="land/index"
          options={{
            title: 'Land',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'map-search' : 'map-search-outline' as TabIconName}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="mutation/index"
          options={{
            title: 'Mutation',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'file-document-edit' : 'file-document-edit-outline' as TabIconName}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="stamp/index"
          options={{
            title: 'More',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'dots-horizontal-circle' : 'dots-horizontal-circle-outline' as TabIconName}
                size={24}
                color={color}
              />
            ),
          }}
        />
        {/* Hidden screens - not in tab bar */}
        <Tabs.Screen
          name="mutation/[state]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="rental/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="browser/index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}

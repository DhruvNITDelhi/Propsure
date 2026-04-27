import React, { useRef, useState } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../constants/theme';

export default function BrowserScreen() {
  const router = useRouter();
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // Here is the infrastructure to track exactly what pages the user visits.
  const handleNavigationStateChange = (navState: any) => {
    // In a production environment, you would log this to your analytics backend
    // to build a profile of what portals and specific land records the user checks.
    console.log(`[Usage Tracker] User navigated to: ${navState.url}`);
    
    // You can also capture title changes, loading state, etc.
    // console.log(`[Usage Tracker] Page Title: ${navState.title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'Internal Browser'}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => webViewRef.current?.reload()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="refresh" size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: url as string }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          allowsBackForwardNavigationGestures
          startInLoadingState={false} // Handled custom above
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    ...typography.h3,
    color: colors.surface,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    width: 32, // Match backButton width for center alignment
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: spacing.xs,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

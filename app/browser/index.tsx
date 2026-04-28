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

  // Inject JS to force all links to open in the same window, preventing external browser popups
  const INJECTED_JAVASCRIPT = `
    (function() {
      // Override window.open to navigate the current frame instead
      window.open = function(url) {
        window.location.href = url;
        return window;
      };

      // Intercept clicks on links with target="_blank" and remove the target attribute
      document.addEventListener('click', function(e) {
        var target = e.target;
        while (target && target.tagName !== 'A') {
          target = target.parentNode;
        }
        if (target && target.getAttribute('target') === '_blank') {
          target.removeAttribute('target');
        }
      }, true);
    })();
    true;
  `;

  const handleNavigationStateChange = () => {
    // No-op: navigation state changes are handled internally by the WebView.
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
          injectedJavaScript={INJECTED_JAVASCRIPT}
          setSupportMultipleWindows={false}
          javaScriptCanOpenWindowsAutomatically={false}
          onShouldStartLoadWithRequest={() => true} // Let the WebView load all requests
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

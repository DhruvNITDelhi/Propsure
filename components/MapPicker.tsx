import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

export interface SelectedLocation {
  latitude: number;
  longitude: number;
}

interface MapPickerProps {
  onLocationSelect: (location: SelectedLocation) => void;
  initialLocation?: SelectedLocation;
}

// Default center: India
const DEFAULT_REGION = {
  latitude: 22.9734,
  longitude: 78.6569,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

export default function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
  const [marker, setMarker] = useState<SelectedLocation | null>(initialLocation || null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const userRegion = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(userRegion);
          if (!initialLocation) {
            setMarker({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        }
      } catch (e) {
        // Location permission denied — use default India view
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const handleConfirm = () => {
    if (marker) {
      onLocationSelect(marker);
    } else {
      Alert.alert('No location selected', 'Please tap on the map to drop a pin on your property.');
    }
  };

  const handleRecenter = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const userRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current?.animateToRegion(userRegion, 500);
    } catch {
      Alert.alert('Location unavailable', 'Please enable location services.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Instructions */}
      <View style={styles.instructionBanner}>
        <MaterialCommunityIcons name="gesture-tap" size={20} color={colors.primary} />
        <Text style={styles.instructionText}>
          Tap on the map to drop a pin on your property. Zoom in for better accuracy.
        </Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onPress={handleMapPress}
          mapType={mapType}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          {...(Platform.OS === 'android' ? { provider: PROVIDER_GOOGLE } : {})}
        >
          {marker && (
            <Marker
              coordinate={marker}
              draggable
              onDragEnd={(e) => {
                setMarker(e.nativeEvent.coordinate);
              }}
              title="Your Property"
              description="Drag to adjust position"
            />
          )}
        </MapView>

        {/* Map controls overlay */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <MaterialCommunityIcons
              name={mapType === 'standard' ? 'satellite-variant' : 'map'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapButton} onPress={handleRecenter}>
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Selected coordinates */}
      {marker && (
        <View style={styles.coordCard}>
          <MaterialCommunityIcons name="map-marker-check" size={18} color={colors.success} />
          <Text style={styles.coordText}>
            {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
          </Text>
        </View>
      )}

      {/* Confirm button */}
      <TouchableOpacity
        style={[styles.confirmButton, !marker && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={!marker}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '0D',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  instructionText: {
    ...typography.body,
    flex: 1,
    color: colors.primary,
    lineHeight: 20,
  },
  mapContainer: {
    height: 320,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    gap: spacing.xs,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  coordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.success + '10',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  coordText: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.success,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  confirmButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});

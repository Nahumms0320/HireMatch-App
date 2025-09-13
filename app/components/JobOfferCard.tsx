import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Pressable, Text, TouchableOpacity, Vibration, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

interface JobOfferCardProps {
  job: {
    id: number;
    titulo: string;
    empresaNombre: string;
    ubicacion: string;
    tipoTrabajo: string;
    tipoContrato: string;
    nivelExperiencia: string;
    salarioFormateado: string;
    tiempoPublicacion: string;
    etiquetas?: string[];
    urgente?: boolean;
    destacada?: boolean;
    mostrarSalario?: boolean;
    areaTrabajo?: string;
  };
  likes: number;
  superLikes: number;
  onLike: () => void;
  onSuperLike: () => void;
  onReject: () => void;
}

const JobOfferCard: React.FC<JobOfferCardProps> = ({ job, likes, superLikes, onLike, onSuperLike, onReject }) => {
  const router = useRouter();

  // Animation states for superlike button
  const scale = useSharedValue(1); // Scale for the button
  const starOpacity = useSharedValue(0); // Opacity for star burst
  const starScale = useSharedValue(0); // Scale for star burst
  const [isSuperLiking, setIsSuperLiking] = useState(false);

  // Animated styles
  const superLikeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const starAnimatedStyle = useAnimatedStyle(() => ({
    opacity: starOpacity.value,
    transform: [{ scale: starScale.value }],
  }));

  // Animation trigger function
  const triggerSuperLikeAnimation = () => {
    if (superLikes === 0 || isSuperLiking) return;

    setIsSuperLiking(true);
    Vibration.vibrate(100); // Haptic feedback

    // Button scale animation: compress then bounce
    scale.value = withSequence(
      withTiming(0.8, { duration: 150 }),
      withSpring(1.2, { damping: 10, stiffness: 100 }, () => {
        scale.value = withSpring(1); // Return to normal
      })
    );

    // Star burst animation: appear and scale up
    starOpacity.value = withTiming(1, { duration: 0 });
    starScale.value = withSpring(1.5, { damping: 5, stiffness: 80 });

    // Reset animation after 800ms
    setTimeout(() => {
      starOpacity.value = withTiming(0, { duration: 500 });
      starScale.value = withTiming(0, { duration: 200 });
      setIsSuperLiking(false);
    }, 800);

    // Call parent onSuperLike (triggers API and swipe in Home.tsx)
    runOnJS(onSuperLike)();
  };

  return (
    <View 
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden"
      style={{
        width: width * 0.9,
        height: height * 0.70,
        elevation: 20,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      }}
    >
      <View className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 to-transparent opacity-60" />
      
      <View className="absolute top-6 left-6 right-6 flex-row justify-between z-10">
        {job.destacada && (
          <View className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-2 flex-row items-center shadow-lg">
            <Icon name="star" size={16} color="black" />
            <Text className="text-black text-xs font-poppins-bold ml-1">DESTACADA</Text>
          </View>
        )}
        {job.urgente && (
          <View className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full px-4 py-2 flex-row items-center shadow-lg">
            <Icon name="schedule" size={16} color="black" />
            <Text className="text-black text-xs font-poppins-bold ml-1">URGENTE</Text>
          </View>
        )}
      </View>

      <View className="flex-1 p-8 pt-20 justify-between">
        <View>
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 rounded-full p-3 mr-3">
              <Icon name="business" size={24} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-poppins-semibold text-gray-700">{job.empresaNombre}</Text>
              <Text className="text-sm font-poppins text-gray-500">{job.areaTrabajo || 'Tecnología'}</Text>
            </View>
          </View>

          <Text className="text-3xl font-poppins-bold text-gray-900 mb-6 leading-tight">
            {job.titulo}
          </Text>

          <View className="bg-gray-50 rounded-2xl p-5 mb-6">
            <View className="flex-row items-center mb-4">
              <Icon name="location-on" size={20} color="#6B7280" />
              <Text className="text-base font-poppins-medium text-gray-700 ml-3">{job.ubicacion}</Text>
            </View>
            
            <View className="flex-row items-center mb-4">
              <Icon name="work" size={20} color="#6B7280" />
              <Text className="text-base font-poppins-medium text-gray-700 ml-3">{job.tipoTrabajo} • {job.tipoContrato}</Text>
            </View>
            
            <View className="flex-row items-center mb-4">
              <Icon name="trending-up" size={20} color="#6B7280" />
              <Text className="text-base font-poppins-medium text-gray-700 ml-3">{job.nivelExperiencia}</Text>
            </View>

            {job.mostrarSalario && (
              <View className="flex-row items-center">
                <Icon name="attach-money" size={20} color="#059669" />
                <Text className="text-base font-poppins-bold text-green-600 ml-3">
                  {job.salarioFormateado || 'Salario competitivo'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View>
          <View className="flex-row items-center justify-center mb-6">
            <Icon name="access-time" size={16} color="#9CA3AF" />
            <Text className="text-sm font-poppins text-gray-500 ml-2">{job.tiempoPublicacion}</Text>
          </View>
          
          <TouchableOpacity
            onPress={() => router.push(`/companyExtraViews/${job.id}`)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl py-4 flex-row items-center justify-center shadow-lg mb-6"
            style={{
              elevation: 8,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Icon name="visibility" size={24} color="black" />
            <Text className="text-black font-poppins-bold text-lg ml-3">Ver Detalles</Text>
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
            <Pressable
              onPress={onReject}
              style={{
                backgroundColor: 'white',
                borderRadius: 30,
                padding: 16,
                borderWidth: 2,
                borderColor: '#FEE2E2',
                elevation: 6,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              <Icon name="close" size={28} color="#EF4444" />
            </Pressable>

            <Pressable
              onPress={triggerSuperLikeAnimation}
              disabled={superLikes === 0 || isSuperLiking}
              style={{
                backgroundColor: superLikes === 0 ? '#D1D5DB' : '#F59E0B',
                borderRadius: 35,
                padding: 20,
                elevation: 10,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                position: 'relative',
              }}
            >
              <Animated.View style={[starAnimatedStyle, {
                position: 'absolute',
                top: -10, left: -10, right: -10, bottom: -10,
                justifyContent: 'center',
                alignItems: 'center',
              }]}>
                <Icon name="star" size={60} color="#FFD700" />
              </Animated.View>
              <Animated.View style={superLikeAnimatedStyle}>
                <Icon name="star" size={32} color={superLikes === 0 ? 'gray' : 'white'} />
              </Animated.View>
            </Pressable>

            <Pressable
              onPress={onLike}
              disabled={likes === 0}
              style={{
                backgroundColor: likes === 0 ? '#D1D5DB' : 'white',
                borderRadius: 30,
                padding: 16,
                borderWidth: 2,
                borderColor: likes === 0 ? '#D1D5DB' : '#D1FAE5',
                elevation: 6,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              <Icon name="favorite" size={28} color={likes === 0 ? 'gray' : '#10B981'} />
            </Pressable>
          </View>
        </View>
      </View>

      <View className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-full p-2">
        <Icon name="swipe" size={20} color="white" />
      </View>
    </View>
  );
};

export default JobOfferCard;
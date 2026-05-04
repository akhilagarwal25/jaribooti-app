import { View, Text, TouchableOpacity } from 'react-native'
import { useAppTheme } from '@/context/ThemeContext'
import { Minus, Plus } from 'lucide-react-native'

interface QuantitySelectorProps {
  value: number
  onChange: (qty: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const { colors } = useAppTheme()

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 4,
    }}>
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: colors.cardDark,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={value <= min}
      >
        <Minus size={16} color={value <= min ? colors.textLight : colors.primary} />
      </TouchableOpacity>

      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        minWidth: 28,
        textAlign: 'center',
      }}>
        {value}
      </Text>

      <TouchableOpacity
        onPress={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={value >= max}
      >
        <Plus size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

import { useState, useEffect, useRef } from "react";
import { Box, Text, Input } from "zmp-ui";
import { MapPin, Search } from "lucide-react";
import { locationService, LocationPrediction } from "../services/location";

interface AddressAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (prediction: LocationPrediction) => void;
  error?: string;
}

export function AddressAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  error,
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<any>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number>();

  // Debounce search để tránh gọi API quá nhiều
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await locationService.autocomplete(value);
        setPredictions(response.predictions || []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error fetching location predictions:", error);
        setPredictions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  // Đóng suggestions khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(target) &&
        inputRef.current &&
        inputRef.current.input &&
        !inputRef.current.input.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSelectPrediction = (prediction: LocationPrediction) => {
    onSelect(prediction);
    setShowSuggestions(false);
    setPredictions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || predictions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handleSelectPrediction(predictions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const formatPredictionText = (prediction: LocationPrediction) => {
    if (prediction.structured_formatting) {
      const { main_text, secondary_text } = prediction.structured_formatting;
      return (
        <Box>
          <Text className="font-medium text-gray-900">{main_text}</Text>
          {secondary_text && (
            <Text className="text-sm text-gray-500">{secondary_text}</Text>
          )}
        </Box>
      );
    }
    return <Text className="text-gray-900">{prediction.description}</Text>;
  };

  return (
    <Box className="relative">
      <Input
        ref={inputRef}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (predictions.length > 0) {
            setShowSuggestions(true);
          }
        }}
      />

      {error && <Text className="text-xs text-red-600 mt-1">{error}</Text>}

      {/* Loading indicator */}
      {isLoading && (
        <Box className="absolute right-3 top-8">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        </Box>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && predictions.length > 0 && (
        <Box
          ref={suggestionsRef as any}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction, index) => (
            <Box
              key={prediction.place_id}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? "bg-primary-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleSelectPrediction(prediction)}
            >
              <Box className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <Box className="flex-1 min-w-0">
                  {formatPredictionText(prediction)}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* No results message */}
      {showSuggestions &&
        predictions.length === 0 &&
        value.trim() &&
        !isLoading && (
          <Box className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <Box className="px-4 py-3 text-center">
              <Search className="w-4 h-4 text-gray-400 mx-auto mb-2" />
              <Text className="text-sm text-gray-500">
                Không tìm thấy địa chỉ phù hợp
              </Text>
            </Box>
          </Box>
        )}
    </Box>
  );
}

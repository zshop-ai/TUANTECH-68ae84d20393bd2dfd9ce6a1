import React, { useState } from "react";
import { Box, Text, Button } from "zmp-ui";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface ProductMediaViewerProps {
  images: string[];
  videoUrl?: string;
  selectedImage: number;
  onImageChange: (index: number) => void;
  onImageClick?: () => void;
}

const ProductMediaViewer: React.FC<ProductMediaViewerProps> = ({
  images,
  videoUrl,
  selectedImage,
  onImageChange,
  onImageClick,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Combine images and video into one array
  const allMedia = React.useMemo(() => {
    const media = [...images];
    if (videoUrl) {
      media.push(videoUrl);
    }
    return media;
  }, [images, videoUrl]);

  const isVideo = (index: number) => {
    return videoUrl && index === images.length;
  };

  const nextMedia = () => {
    const nextIndex = (currentMediaIndex + 1) % allMedia.length;
    setCurrentMediaIndex(nextIndex);
    onImageChange(nextIndex);
    setIsVideoPlaying(false);
  };

  const prevMedia = () => {
    const prevIndex =
      currentMediaIndex === 0 ? allMedia.length - 1 : currentMediaIndex - 1;
    setCurrentMediaIndex(prevIndex);
    onImageChange(prevIndex);
    setIsVideoPlaying(false);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  if (allMedia.length === 0) {
    return (
      <Box className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <Text className="text-gray-500">Không có hình ảnh</Text>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      {/* Main Media Display */}
      <Box className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        {isVideo(currentMediaIndex) ? (
          <Box className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              controls={isVideoPlaying}
              autoPlay={isVideoPlaying}
              loop
              muted
            >
              <source src={videoUrl} type="video/mp4" />
              Trình duyệt không hỗ trợ video.
            </video>
            {!isVideoPlaying && (
              <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Button
                  variant="secondary"
                  size="large"
                  className="w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100"
                  onClick={toggleVideo}
                >
                  <Play className="w-8 h-8 text-primary-600" />
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <img
            src={allMedia[currentMediaIndex]}
            alt={`Product image ${currentMediaIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={onImageClick}
          />
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="small"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
              onClick={prevMedia}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="small"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
              onClick={nextMedia}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Media Counter */}
        <Box className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {currentMediaIndex + 1} / {allMedia.length}
        </Box>
      </Box>

      {/* Thumbnail Navigation */}
      {allMedia.length > 1 && (
        <Box className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {allMedia.map((media, index) => (
            <Box
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                currentMediaIndex === index
                  ? "border-primary-600"
                  : "border-gray-200"
              }`}
              onClick={() => {
                setCurrentMediaIndex(index);
                onImageChange(index);
                setIsVideoPlaying(false);
              }}
            >
              {isVideo(index) ? (
                <Box className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </Box>
              ) : (
                <img
                  src={media}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductMediaViewer;

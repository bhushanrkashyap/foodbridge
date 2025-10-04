import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoUpload = ({ photos, onPhotosChange, maxPhotos = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files?.filter(file => file?.type?.startsWith('image/'));
    const remainingSlots = maxPhotos - photos?.length;
    const filesToProcess = imageFiles?.slice(0, remainingSlots);

    filesToProcess?.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          file,
          preview: e?.target?.result,
          name: file?.name,
          size: file?.size
        };
        onPhotosChange([...photos, newPhoto]);
      };
      reader?.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId) => {
    onPhotosChange(photos?.filter(photo => photo?.id !== photoId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        } ${photos?.length >= maxPhotos ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Camera" size={24} className="text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Upload Food Photos
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop images here, or click to select files
          </p>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            disabled={photos?.length >= maxPhotos}
            iconName="Upload"
            iconPosition="left"
          >
            Choose Photos
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            {photos?.length}/{maxPhotos} photos • PNG, JPG up to 10MB each
          </p>
        </div>
      </div>
      {/* Photo Preview Grid */}
      {photos?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {photos?.map((photo) => (
            <div key={photo?.id} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src={photo?.preview}
                  alt={`Food photo ${photo?.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => removePhoto(photo?.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
              >
                <Icon name="X" size={14} />
              </button>
              
              {/* File Info */}
              <div className="mt-1 text-xs text-muted-foreground truncate">
                {formatFileSize(photo?.size)}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Upload Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-heading font-semibold text-foreground mb-2">
          Photo Tips for Better Matching
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Take clear, well-lit photos of the food</li>
          <li>• Show packaging labels and expiry dates when visible</li>
          <li>• Include multiple angles for prepared meals</li>
          <li>• Ensure photos accurately represent quantity</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUpload;
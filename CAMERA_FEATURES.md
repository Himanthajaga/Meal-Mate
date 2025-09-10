# Camera Features Documentation

## Overview

The Meal Mate app now includes comprehensive camera functionality for enhanced meal management and QR code scanning capabilities.

## Features

### 📸 **Camera Functionality**

- **Take Photos**: Capture high-quality photos of your meals
- **Front/Back Camera**: Easily switch between front and rear cameras
- **Auto-save to Gallery**: Photos are automatically saved to your device's photo library
- **Direct Integration**: Photos taken can be directly used in meal creation

### 📱 **Gallery Access**

- **Image Selection**: Choose existing photos from your device gallery
- **Direct Integration**: Selected images automatically populate meal creation forms
- **Quality Control**: Images are optimized for app performance

### 🔍 **QR Code Scanner**

- **QR Code Detection**: Scan any QR code using your device camera
- **URL Opening**: Automatically detect and open web URLs from QR codes
- **Visual Feedback**: Clear scanning frame with corner indicators
- **Real-time Scanning**: Instant QR code detection and processing

## How to Use

### Accessing the Camera

1. **From Home Screen**: Tap the "Camera" quick action card
2. **From Navigation**: Tap the "Camera" tab in the bottom navigation
3. **From Meal Creation**: Tap "Take Photo with Camera" when creating/editing meals

### Taking Photos

1. Open the camera screen
2. Point your camera at the subject
3. Tap the white circle button to capture
4. The photo will be saved to your gallery automatically
5. You can navigate to meal creation from there

### Switching Camera Mode

- Tap the flip icon (🔄) in the top-right corner to switch between front and back cameras

### Scanning QR Codes

1. Tap the QR scanner icon to enable scanning mode
2. Point your camera at a QR code
3. Position the QR code within the scanning frame
4. The app will automatically detect and process the QR code
5. If it's a URL, you'll get an option to open it

### Gallery Access

1. From the camera screen, tap the gallery icon (📷) in the bottom-left
2. Select an image from your gallery
3. The selected image will be used for meal creation

## Permissions Required

The app requires the following permissions:

- **Camera Permission**: To take photos and scan QR codes
- **Media Library Permission**: To save photos and access existing images
- **Photo Library Permission**: To select images from gallery

## Integration Points

### Meal Creation

- Camera photos automatically populate the meal image field
- Gallery images can be selected and used immediately
- Images are uploaded to Cloudinary for storage

### Navigation

- Camera accessible from multiple entry points
- Seamless integration with meal planning workflow
- Quick access via home screen and navigation tabs

## Technical Details

### Camera Controls

- **Capture Button**: Large white circle for taking photos
- **Flip Camera**: Toggle between front/back cameras
- **Gallery Access**: Quick access to photo library
- **Mode Switch**: Toggle between camera and QR scanner modes

### QR Code Scanning

- **Real-time Detection**: Uses expo-barcode-scanner for instant QR detection
- **Visual Indicators**: Scanning frame with corner markers
- **URL Handling**: Automatic detection and opening of web URLs
- **Error Handling**: Graceful handling of invalid or non-URL QR codes

### File Handling

- **Quality Optimization**: Images compressed to 0.8 quality for performance
- **Format Support**: Supports JPEG and other common image formats
- **Cloud Storage**: Integration with Cloudinary for reliable image hosting

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure to grant camera and media library permissions
2. **Camera Not Working**: Check if another app is using the camera
3. **QR Code Not Scanning**: Ensure good lighting and clear view of QR code
4. **Gallery Access Failed**: Verify media library permissions are granted

### Error Messages

- **"Permission required"**: Grant necessary permissions in device settings
- **"Failed to take picture"**: Try closing other camera apps and retry
- **"Invalid URL"**: QR code doesn't contain a valid web URL
- **"Failed to open gallery"**: Check media library permissions

## Future Enhancements

- Batch photo capture
- Advanced QR code types (contacts, WiFi, etc.)
- Photo editing capabilities
- Custom QR code generation for meal sharing
- AR meal identification features

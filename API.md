# API Documentation

## Endpoints

### 1. File Upload
- **Endpoint**: `/api/upload`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Request Body**:
  ```
  file: File (image/jpeg, image/png, image/webp, application/pdf)
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "File uploaded successfully",
    "file": {
      "name": "original-filename.jpg",
      "size": 123456,
      "type": "image/jpeg",
      "path": "timestamp-filename.jpg"
    }
  }
  ```

### 2. OCR Processing
- **Endpoint**: `/api/ocr`
- **Method**: POST
- **Content-Type**: application/json
- **Request Body**:
  ```json
  {
    "filePath": "timestamp-filename.jpg"
  }
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "OCR processing completed",
    "result": {
      "text": "extracted text from image",
      "confidence": 0.95,
      "processingTimeMs": 100
    }
  }
  ```

### 3. NLP Processing
- **Endpoint**: `/api/nlp`
- **Method**: POST
- **Content-Type**: application/json
- **Request Body**:
  ```json
  {
    "text": "extracted text from OCR"
  }
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "NLP processing completed",
    "result": {
      "classes": [
        {
          "courseName": "Course Name",
          "day": "Day of Week",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "venue": "Room Location"
        }
      ],
      "confidence": 0.90,
      "processingTimeMs": 50
    }
  }
  ```

## Implementation Notes

### For OCR Team:
1. The OCR endpoint receives a file path relative to the `tmp/uploads` directory
2. Implement your OCR logic to extract text from the image
3. Return the extracted text along with confidence scores
4. Handle different image formats (JPEG, PNG, WebP) and PDF

### For NLP Team:
1. The NLP endpoint receives raw text extracted by the OCR
2. Implement text processing to identify:
   - Course names
   - Days of the week
   - Time slots
   - Venue information
3. Return structured data in the specified format
4. Handle various timetable formats and layouts

## Error Handling
All endpoints should return appropriate error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 500: Internal Server Error

## Testing
Test files are available in the `tmp/uploads` directory. Each file is prefixed with a timestamp for uniqueness.

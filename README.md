
# X-Detect Machine Learning Models

X-Detect Machine Learning Models is a project that utilizes machine learning algorithms to predict diseases in the chest or thoracic area based on input images of X-ray scans. This project is designed for healthcare professionals, researchers, and developers working in the field of medical imaging analysis.

# Endpoint /predict

This endpoint allows you to load a model and make predictions on an uploaded image file.

## Dependencies

- Express.js
- TensorFlow.js (Node.js version)
- Multer
- Sharp
- Moment Timezone

## Installation

1. Install the required dependencies by running the following command: 

`npm install express @tensorflow/tfjs-node multer sharp moment-timezone`

2. Create a new file, e.g., `index.js`, and copy the provided code into it.

3. Run the server by executing the following command:

`node index.js`

4. The server will start running on port 8080. You can access the endpoint at `http://localhost:8080/predict`.

## Usage

### Request

- Method: POST
- Endpoint: /predict
- Content-Type: multipart/form-data

#### Request Parameters

- `image`: The image file to be processed. This should be included as a form-data field with the key `image`.

#### Example
- Key: `image`
- Value: Select File and choose your X-ray image file.

### Response

The server will respond with a JSON object containing the predictions and additional information.

#### Response Format

- `predictions`: An object containing the labels as keys and the predicted percentages as values.
- `maxLabel`: The label with the highest predicted percentage.
- `label`: The label name.
- `percentage`: The percentage value.
- `created`: The current date and time in the Asia/Jakarta timezone.
- `additionalInfo`: Additional information based on the predicted label.
- `description`: Description of the condition.
- `symptoms`: Array of symptoms associated with the condition.
- `nextSteps`: Array of recommended next steps for the condition.
- `recommendation`: Recommendation for further action.
- `action`: Action to be taken.
- `message`: Message suggesting consultation with a specialist based on the predicted label.

#### Example Response

```json
{
"predictions": {
 "Mass": "60.12%",
 "Nodule": "20.45%",
 "Normal": "5.80%",
 "Pneumonia": "7.33%",
 "Tuberculosis": "6.30%"
},
"maxLabel": {
 "label": "Mass",
 "percentage": "60.12%"
},
"created": "6/8/2023, 10:30:00 AM",
"additionalInfo": {
 "description": "Adanya massa atau tumor di paru-paru, yang bisa bersifat jinak atau ganas.",
 "symptoms": ["Batuk", "Sesak napas", "Nyeri dada"],
 "nextSteps": [
   "Konsultasikan dengan spesialis untuk evaluasi lebih lanjut",
   "Tambahan tes mungkin diperlukan",
   "Ikuti rencana perawatan yang direkomendasikan"
 ]
},
"recommendation": {
 "action": "Mohon segera lakukan konsultasi dengan dokter spesialis",
 "message": "Berdasarkan prediksi Mass, disarankan untuk konsultasikan dengan spesialis untuk evaluasi lebih lanjut dan pengobatan yang tepat."
}
}
```

Note: Ensure that the model file model.json is located in the 90acc+/ directory relative to the `index.js` file.

Please adjust the code and instructions as necessary for your specific use case.

Thankyou!

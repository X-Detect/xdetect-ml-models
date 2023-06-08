const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const sharp = require('sharp');
const app = express();
const moment = require("moment-timezone");

// Konfigurasi multer untuk meng-handle file upload
const upload = multer({ dest: 'uploads/' });

// Endpoint untuk memuat model dan melakukan prediksi pada file gambar
app.post('/predict', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;
  const modelPath = './90acc+/model.json';

  try {
    // Memuat model dan file bin
    const model = await tf.loadLayersModel(`file://${modelPath}`);

    // Memproses file gambar
    const processedImage = await preprocessImage(imagePath);

    // Lakukan prediksi pada gambar yang telah diproses
    const input = tf.expandDims(processedImage, 0);
    const output = model.predict(input);
    const prediction = Array.from(output.dataSync());

    // Mendapatkan waktu saat ini dengan zona waktu GMT+7
    const currentTime = moment().tz("Asia/Jakarta").format("M/D/YYYY, h:mm:ss A");

    // Mendapatkan label dan nilai prediksi dalam persentase
    const labels = ["Mass", "Nodule", "Normal", "Pneumonia", "Tuberculosis"];
    const predictionObject = {};

    prediction.forEach((value, index) => {
      const label = labels[index];
      const percentage = (value * 100).toFixed(2);
      predictionObject[label] = percentage + "%";
    });

    // eslint-disable-next-line max-len
    const maxLabel = Object.keys(predictionObject).reduce(
        (a, b) =>
          predictionObject[a] > predictionObject[b] ? a : b,
    );
    const maxLabelPercentage = predictionObject[maxLabel];
    // Informasi tambahan berdasarkan label
    const additionalInfo = {
      Normal: {
        description: "Kondisi normal tanpa adanya kelainan pada paru-paru.",
        symptoms: [],
        nextSteps: [],
      },
      Mass: {
        description: "Adanya massa atau tumor di paru-paru, yang bisa bersifat jinak atau ganas.",
        symptoms: ["Batuk", "Sesak napas", "Nyeri dada"],
        nextSteps: [
          "Konsultasikan dengan spesialis untuk evaluasi lebih lanjut",
          "Tambahan tes mungkin diperlukan",
          "Ikuti rencana perawatan yang direkomendasikan",
        ],
      },
      Nodule: {
        description: "Adanya pertumbuhan atau benjolan kecil yang tidak normal di paru-paru, yang bisa bersifat jinak atau ganas.",
        symptoms: ["Batuk", "Sesak napas", "Nyeri dada"],
        nextSteps: [
          "Konsultasikan dengan spesialis untuk evaluasi lebih lanjut",
          "Tambahan tes mungkin diperlukan",
          "Ikuti rencana perawatan yang direkomendasikan",
        ],
      },
      Pneumonia: {
        description: "Infeksi pada satu atau kedua paru-paru, yang bisa menyebabkan peradangan dan gejala pernapasan.",
        symptoms: ["Demam", "Batuk", "Sesak napas", "Nyeri dada"],
        nextSteps: [
          "Cari perhatian medis untuk diagnosis dan pengobatan",
          "Konsumsi obat yang diresepkan",
          "Istirahat yang cukup dan tetap terhidrasi",
        ],
      },
      Tuberculosis: {
        description: "Infeksi bakteri yang terutama mempengaruhi paru-paru, tetapi juga dapat mempengaruhi bagian tubuh lainnya.",
        symptoms: ["Batuk yang tidak kunjung sembuh", "Nyeri dada", "Kelelahan", "Demam", "Penurunan berat badan"],
        nextSteps: [
          "Cari perhatian medis untuk diagnosis dan pengobatan",
          "Ikuti jadwal pengobatan yang diresepkan",
          "Ambil tindakan pencegahan untuk mencegah penyebaran infeksi kepada orang lain",
        ],
      },
    };


    const recommendation = {
      action: "Mohon segera lakukan konsultasi dengan dokter spesialis",
      message: `Berdasarkan prediksi ${maxLabel}, disarankan untuk konsultasikan dengan spesialis untuk evaluasi lebih lanjut dan pengobatan yang tepat.`,
    };

    const jsonResponse = {
      predictions: predictionObject,
      maxLabel: {
        label: maxLabel,
        percentage: maxLabelPercentage,
      },
      created: currentTime,
      additionalInfo: additionalInfo[maxLabel],
      recommendation: recommendation,
    };

    res.json(jsonResponse);


  } catch (error) {
    console.error('Error loading model or predicting image:', error);
    res.status(500).json({ error: 'Failed to load model or predict image.' });
  }
    
});

// Fungsi untuk memproses gambar
async function preprocessImage(imagePath) {
  try {
    // Membaca file gambar menggunakan sharp
    const image = sharp(imagePath);

    // Mengubah ukuran gambar jika diperlukan
    const resizedImage = await image.resize(224, 224).toBuffer();

    // Mengonversi gambar menjadi array piksel
    const buffer = tf.node.decodeImage(resizedImage, 3); // Menggunakan 3 channel karena gambar berwarna
    const normalizedImage = tf.cast(buffer, 'float32').div(255);

    return normalizedImage;
  } catch (error) {
    throw new Error('Failed to preprocess image.');
  }
}

// Jalankan server Express.js
app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
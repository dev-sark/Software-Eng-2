import Tesseract from 'tesseract.js';

self.onmessage = async (event) => {
  try {
    const { file } = event.data;
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => {
          console.log(m);
          self.postMessage({ type: 'progress', progress: m.progress });
        }
      }
    );
    self.postMessage({ type: 'result', text });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};

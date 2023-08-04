const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.set('json spacing',2);

// Konfigurasi penyimpanan file menggunakan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Simpan file di direktori 'uploads'
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const newFileName = `${Date.now()}${fileExtension}`;
    cb(null, newFileName); // Atur nama file
  }
});

const upload = multer({ storage: storage });

// Set halaman index untuk mengunggah gambar
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint untuk mengunggah gambar
app.post('/upload', upload.single('gambar'), (req, res) => {
  if (!req.file) {
    // Jika tidak ada gambar yang dipilih, kirim pesan kesalahan ke klien
    return res.status(400).send('Anda harus memilih file untuk diunggah.');
  }
  const imageURL = `/uploads/${req.file.filename}`;
  const linkHTML = `<a href="${imageURL}" target="_blank" class="link-style">File berhasil diunggah. Lihat File</a>`;
  res.send(linkHTML);
});

app.get('/filelist', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Gagal mendapatkan daftar file.');
    }
    res.json(files);
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.get('/admin', async(req,res) => {
  var key = req.query.key;
  if(!key) return res.send('Khusus admin bro!!');
  if(key != 'zeev') return res.send('Apa mo buka privasi orang?');
  fs.readFile('./admin.html',(err,data) => {
    if(err) return res.send('Error code 404');
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    res.end();
  });
});
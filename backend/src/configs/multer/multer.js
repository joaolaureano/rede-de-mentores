import multer from 'multer';

// Em memoria: so a rota local de upload (desenvolvimento, sem bucket) recebe
// arquivo; as rotas da API usam upload.none() - claim check, ver imageStorage.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
  }
};

// A Function URL da Lambda aceita no maximo 6 MB de payload
const upload = multer({ storage, fileFilter, limits: { fileSize: 4 * 1024 * 1024 } });

export default upload;

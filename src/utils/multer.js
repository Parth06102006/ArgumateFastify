import multer from "multer"
import fs from 'fs'
import path from 'path'


const __dirname = path.dirname('C:\\Users\\Parth garg\\OneDrive\\Desktop\\filelogs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const  filePath = path.join(__dirname,'/my-uploads');
      let fileExistence =  fs.existsSync(filePath);
      if (fileExistence)
      {
        cb(null, filePath)
      }
      else
      {
        console.log('FilePath is not created let me create one');
        fs.mkdirSync(filePath,{recursive:false})
        cb(null, filePath)
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  
export const upload = multer({ storage: storage})
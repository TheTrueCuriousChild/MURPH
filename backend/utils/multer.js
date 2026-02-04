import multer from "multer"
import path from "path";

const storage= multer.diskStorage({
    destination: function(req, file, cb){
        switch (file.fieldname){
            case "lecture":
                cb(null, path.resolve("uploads/lectures"));
                break;
            default:
                cb("The fieldname is invalid!", null);
        }
    },

    filename: function(req, file, cb)
    {
        return cb(null, file.originalname)
    }
})

const uploader=multer({storage});
const uploadSingle=(fieldname)=>{
    return uploader.single(fieldname);
}
const uploadMultiple=(fieldsArray)=>{
    return uploader.fields(fieldsArray);
}

export {
    uploadSingle, uploadMultiple
};
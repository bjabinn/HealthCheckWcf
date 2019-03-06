using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Back
{
    class UploadDrive
    {
        public static void UploadJson(string path, DriveService service)
        {
            try
            {
                var fileMetadata = new Google.Apis.Drive.v3.Data.File();
                string mimeType = Helpers.GetMimeType(path);

                fileMetadata.Name = Path.GetFileName(path);
                fileMetadata.MimeType = mimeType;
                FilesResource.CreateMediaUpload request;

                using (var stream = new System.IO.FileStream(path,System.IO.FileMode.Open)){

                    request = service.Files.Create(fileMetadata, stream, mimeType);
                    request.Fields = "id";
                    request.Upload();
                }

                var file = request.ResponseBody;
                System.Console.WriteLine("Uploaded "+ fileMetadata.Name +" with file ID: " + file.Id); 
            }
            catch (System.Exception ex)
            {
                ex.Data["ErrorInfo"] += string.Format("\nERROR: Failed while uploading file with exception: {0}", ex.Message);
                throw ex;
            }
            
        }
    }
}
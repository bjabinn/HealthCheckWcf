using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace Back.GDrive
{
    class GDriveService
    {
        static string[] Scopes = { DriveService.Scope.Drive };
        public static DriveService GetService(string applicationName, string credentialsFile)
        {
            string ApplicationName = applicationName;
            UserCredential credential;

            try
            {
                using (var stream =
                    new FileStream(credentialsFile, FileMode.Open, FileAccess.Read))
                {
                    // The file token.json stores the user's access and refresh tokens, and is created
                    // automatically when the authorization flow completes for the first time.
                    string credPath = "GDrive/files/token.json";
                    credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                        GoogleClientSecrets.Load(stream).Secrets,
                        Scopes,
                        "user",
                        CancellationToken.None,
                        new FileDataStore(credPath, true)).Result;
                    Console.WriteLine("Credential file saved to: " + credPath);
                }
            }
            catch (System.Exception ex)
            {  
                ex.Data["ErrorInfo"] += string.Format("\nERROR: Failed while creating service with exception: {0}", ex.Message);
                throw ex;
            }

            // Create Drive API service.
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName
            });

            return service;

        }
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

        public static void UpdateJson(string path, DriveService service)
        {
            try
            {
                var fileMetadata = new Google.Apis.Drive.v3.Data.File();
                string mimeType = Helpers.GetMimeType(path);
                string fileID = GetFileID(path.Substring(path.LastIndexOf('/') + 1),service);

                fileMetadata.Name = Path.GetFileName(path);
                fileMetadata.MimeType = mimeType;
                FilesResource.UpdateMediaUpload request;
                
                using (var stream = new System.IO.FileStream(path,System.IO.FileMode.Open)){

                    request = service.Files.Update(fileMetadata, fileID, stream, mimeType);
                    request.Upload();
                }

                System.Console.WriteLine("Updated "+ fileMetadata.Name +" with file ID: " + fileID); 
            }
            catch (System.Exception ex)
            {
                ex.Data["ErrorInfo"] += string.Format("\nERROR: Failed while updating file with exception: {0}", ex.Message);
                throw ex;
            }
            
        }

        public static string GetFileID(string fileName, DriveService service)
        {
            string fileID = string.Empty;

            FilesResource.ListRequest listRequest = service.Files.List();
            listRequest.PageSize = 10;
            listRequest.Fields = "nextPageToken, files(id, name)";

            IList<Google.Apis.Drive.v3.Data.File> files = listRequest.Execute().Files;

            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    if(file.Name.Equals(fileName))
                    {
                        fileID = file.Id;
                        break;
                    }
                }
            }

            if(String.IsNullOrEmpty(fileID))
            {
                string path = string.Format("files/{0}",fileName);
                UploadJson(path, service);
                fileID = GetFileID(fileName,service);
            }

            return fileID;
        }
    }
}

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

namespace prueba1
{
    class Program
    {
        // If modifying these scopes, delete your previously saved credentials
        // at ~/.credentials/drive-dotnet-quickstart.json
        static string[] Scopes = { DriveService.Scope.Drive };
        static string ApplicationName = "Drive API .NET Quickstart";

        static void Main(string[] args)
        {
            UserCredential credential;

            using (var stream =
                new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                // The file token.json stores the user's access and refresh tokens, and is created
                // automatically when the authorization flow completes for the first time.
                string credPath = "token.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;
                Console.WriteLine("Credential file saved to: " + credPath);
            }

            // Create Drive API service.
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });

            // Define parameters of request.
            FilesResource.ListRequest listRequest = service.Files.List();
            listRequest.PageSize = 10;
            listRequest.Fields = "nextPageToken, files(id, name)";

            // List files.
            var files = listRequest.Execute()
                .Files;
            Console.WriteLine("Files:");
            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    Console.WriteLine("{0} ({1})", file.Name, file.Id);
                }
            }
            else
            {
                Console.WriteLine("No files found.");
            }

            //UploadJson("C:\\testJson.json", service);

            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = "testJson.json"
            };

            fileMetadata.Name = Path.GetFileName("files/testJson.json");
            fileMetadata.MimeType = "application/json";
            FilesResource.CreateMediaUpload request;

            using (var stream = new System.IO.FileStream("files/testJson.json",System.IO.FileMode.Open)){

                request = service.Files.Create(fileMetadata,stream,"application/json");
                request.Fields = "id";
                request.Upload();
            }

            var fileUp = request.ResponseBody;
            //System.Console.WriteLine("File ID: " + file.Id);
            System.Console.WriteLine("Upload done");

            Console.Read();

        }

        // private static void UploadJson(string path, DriveService service){

        //     var fileMetadata = new Google.Apis.Drive.v3.Data.File()
        //     {
        //         Name = "testJson.json"
        //     };

        //     fileMetadata.Name = Path.GetFileName(path);
        //     fileMetadata.MimeType = "application/json";
        //     FilesResource.CreateMediaUpload request;

        //     using (var stream = new System.IO.FileStream(path,System.IO.FileMode.Open)){

        //         request = service.Files.Create(fileMetadata,stream,"application/json");
        //         request.Fields = "id";
        //         request.Upload();
        //     }

        //     var file = request.ResponseBody;
        //     //System.Console.WriteLine("File ID: " + file.Id);
        //     System.Console.WriteLine("Upload done");
        // }
    }
}

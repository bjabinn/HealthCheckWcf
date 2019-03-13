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
    }
}

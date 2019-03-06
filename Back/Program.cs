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
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var service = GDriveService.GetService("HealthCheckWcf","credentials.json");
                UploadDrive.UploadJson("files/testJson.json", service); 
            }
            catch (System.Exception ex)
            {               
                System.Console.WriteLine(ex.Data["ErrorInfo"]);
            }
            
        }
    }
}

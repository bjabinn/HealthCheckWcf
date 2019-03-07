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
using Newtonsoft.Json;

namespace Back
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = "files/test.json";
            var model1 = new Model();
            model1.apellidos = "Gadea";
            model1.nombre = "Jose Carlos";
            model1.tiempo = 150;

            try
            {
                JsonWriter.WriteJson(model1, path);
                var service = GDriveService.GetService("HealthCheckWcf","credentials.json");
                UploadDrive.UploadJson(path, service); 
            }
            catch (System.Exception ex)
            {               
                System.Console.WriteLine(ex.Data["ErrorInfo"]);
            }
            
            System.Console.WriteLine("Press Enter to exit...");
            System.Console.ReadLine();
        }  
    }
}

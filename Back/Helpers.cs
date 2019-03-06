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
    class Helpers
    {
        public static string GetMimeType(string path)
        {
            string mimeType = "application/unknown";
            string ext = string.Empty;

            try
            {
                ext = System.IO.Path.GetExtension(path).ToLower();
            }
            catch (System.Exception ex)
            {
                ex.Data["ErrorInfo"] += string.Format("\nERROR: Failed while accesing file to upload with exception: {0}",ex.Message);
                throw ex;
            }
            
            Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext);
            if (regKey != null && regKey.GetValue("Content Type") != null){

                mimeType = regKey.GetValue("Content Type").ToString();

            }else{

                if (ext.Equals(".json"))
                {
                    mimeType = "application/json";
                }
            }

            return mimeType;
        }
    }
}
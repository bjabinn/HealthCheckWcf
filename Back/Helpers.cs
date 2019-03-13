using Newtonsoft.Json;

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

         public static void WriteJson(object model, string path)
        {
            string jsonString = string.Empty;

            try
            {
               jsonString = JsonConvert.SerializeObject(model); 
            }
            catch (System.Exception e)
            {
                e.Data["ErrorInfo"] += string.Format("\nERROR: Failed while serializing model to JSON with exception: {0}",e.Message);
                throw e;
            }
            
            try
            {
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(path) )
                {
                    file.WriteLine(jsonString);
                }
            }
            catch (System.Exception ex)
            {
                ex.Data["ErrorInfo"] += string.Format("\nERROR: Failed while writing JSON to file with exception: {0}",ex.Message);
                throw ex;
            }      
        }
    }
}
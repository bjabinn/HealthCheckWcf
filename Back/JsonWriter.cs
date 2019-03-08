using Newtonsoft.Json;

namespace Back
{
    public class JsonWriter
    {
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
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http;
using System;
using System.Threading.Tasks;
using Back.Models;

namespace Back.APICaller
{
    class CheckAPI
    {
        private static async Task<string> CallAPI(string url)
        {
            HttpResponseMessage response = null;

            using (HttpClient client = new HttpClient())
            {
                try	
                {
                    response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();

                    return responseBody;
                }  
                catch(HttpRequestException e)
                {
                    e.Data["ErrorInfo"] += string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message);
                    throw e;
                }
            }
        }

        public static async Task<Response> MeasureResponse(string url)
        {
            Stopwatch ResponseTimer = new Stopwatch();
            ResponseTimer.Start();
            await CallAPI(url);
            ResponseTimer.Stop();

            return new Response((int)ResponseTimer.ElapsedMilliseconds,DateTime.Now.ToString());
            //System.Console.WriteLine("Response time: {0}ms", ResponseTimer.ElapsedMilliseconds);
        }
    }    
}
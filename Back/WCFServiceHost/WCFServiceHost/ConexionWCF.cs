using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace WCFServiceHost
{
    public class ConexionWCF : IConexionWCF
    {

        public string GetData(string value)
        {
            return string.Format("You entered: {0}", value);
        }

        public string GetMessage(string name)
        {
            return "Hello " + name;
        }

        public string MostrarMensaje()
        {
            return "This was a triumph. I'm making a note here: HUGE SUCCESS";
        }
    }
}

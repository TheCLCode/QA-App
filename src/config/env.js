const hostname = window && window.location && window.location.hostname;
var URL = "";
if(hostname==="herokuapp.com"){
	URL = "http://theclcode-qandapp.herokuapp.com";
} else{
	URL = process.env.REACT_APP_BACKEND_HOST || "http://localhost:8081";
}
export const config = {
	URL
};

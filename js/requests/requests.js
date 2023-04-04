const URL = "http://twserver.alunos.dcc.fc.up.pt:9047/";

class MyRequest {
  constructor(method, url, obj) {
    this.method_ = method;
    this.url_ = url;
    this.obj_ = obj;
    this.ESListen = false;
  }

  async sendRequest() {
    if (this.method_ === "GET") {
      try {
        /*const response_1 = await fetch(URL + this.url_);
                const data = await response_1.json();
                return data;*/

        let urlencoded = "?nick=" + String(this.obj_.nick) + "&game=" + String(this.obj_.game);

        if(!this.ESListen){
          const eventSource = new EventSource(URL + this.url_ + urlencoded); //no inicio

          eventSource.onstart = function () {
            console.log("Connection with server established");
          };
        }
        else{
          eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log(data);
          };

          eventSource.onerror = function (event) {
            console.log("Error:", event);
          };
        }
      } catch (error) {
        console.log("Error:", error);
      }
    } else if (this.method_ === "POST") {
      try {
        if(this.url_ === "leave" && this.ESListen){
          eventSource.close();
          this.ESListen=false;
        }
        const response_1 = await fetch(URL + this.url_, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Access-Control-Allow-Origin",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(this.obj_),
        });
        const data = await response_1.json();
        return data;
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
}

export { MyRequest };

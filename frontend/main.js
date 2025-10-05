import {GreetService} from "./bindings2/changeme";
import {Events} from "./runtime";

Events.OffAll();

const resultElement1 = document.getElementById('result1');
const resultElement2 = document.getElementById('result2');

window.doGreetHttp = () => {
    let name = document.getElementById('name1').value;
    if (!name) {
        name = 'anonymous';
    }
    GreetService.Greet(name).then((result) => {
        resultElement1.innerText = result;
    }).catch((err) => {
        console.log(err);
    });
}

window.doGreetPostMessage = () => {
    let name = document.getElementById('name2').value;
    if (!name) {
        name = 'anonymous';
    }
    GreetService.GreetPostMessage(name).then((result) => {
      console.log()
        resultElement2.innerText = result;
    }).catch((err) => {
        console.log(err);
    });
}

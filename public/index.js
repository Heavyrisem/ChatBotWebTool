let Labels = [];



const GetLabels = () => {
    WarnDisplay("서버 정보 가져오는 중..")
    SendData({}, 'https://kkds.kr/ChatBotDataLabels', Response => {
        Labels = JSON.parse(Response);
        console.log(Response)
        WarnDisplay("입력 후 확인버튼을 눌러 주세요")
    });
}


const CheckValues = () => {
    let Inputs = {
        tag: document.getElementById("tag").value,
        patterns: document.getElementById("patterns").value,
        responses: document.getElementById("responses").value
    }

    for (const field in Inputs) {
        if (Inputs[field] == '') {
            WarnDisplay(`${field} 값은 공백일 수 없습니다.`);
            return;
        }
        switch (field) {
            case "tag": break;
            default: {
                // Inputs[field] = Inputs[field].split(",");
                break;
            }
        }
    }

    SendData(Inputs, 'https://kkds.kr/ChatBotDataUpload', Response => {
        WarnDisplay(Response);
        document.getElementById("tag").value = "";
        document.getElementById("patterns").value = "";
        document.getElementById("responses").value = "";
        GetLabels();
    });
}

let SendStatus = false;
const SendData = (Data, URL, CallBack) => {
    if (SendStatus) return WarnDisplay("서버 응답 대기중입니다.");
    let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        WarnDisplay("httpRequest 객체를 생성할수 없습니다. 브라우져 호환을 확인해 주세요");
        return;
    }

    SendStatus = true;
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            SendStatus = false;
            if (httpRequest.status === 200) {
                CallBack(httpRequest.responseText);
            } else {
                WarnDisplay(`서버 통신에 실패했습니다. (${httpRequest.status})`);
            }
        }
    }
    httpRequest.open('POST', URL);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(JSON.stringify(Data));

}


const WarnDisplay = (Msg) => {
    if (!Msg) return console.log("Null message recived");
    let Warn = document.getElementById("WarnMsg");
    
    Warn.innerText = Msg;
}
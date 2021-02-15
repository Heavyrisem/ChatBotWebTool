import { opine, serveStatic, json, urlencoded } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { intentsT, intentT } from "./Types.ts";
import * as log from "./consolelog.ts";
log.init('Server');
const app = opine();
const PATH = "./intents.json";

let intents: intentsT;

app.use(async (req, res, next) => {
	if (!(req.url.indexOf("index.html") == -1) || req.url != '/') return next();
	
    const UserAgent = req.headers.get('User-Agent');
    if (UserAgent != undefined && UserAgent != null) {
		if (UserAgent.indexOf("Headless") != -1) {
			console.log("System", "BotDetected", UserAgent, req.headers.get('x-forwarded-for'))
			return res.send("오류가 발생했습니다.");
		}
	}
	
	console.log("System", "HTML Request", UserAgent, req.headers.get('x-forwarded-for'));
	// res.set('Content-Type', 'text/Html');
	// res.end(await Deno.readTextFile('./public/index.html'));
	next();
})
app.use(serveStatic('./public'));
app.use(json());
app.use(urlencoded()); // for parsing application/x-www-form-urlencoded

// app.get("/", (req, res) => {
// 	res.redirect("/index.html");
// })

app.post("/ChatBotDataUpload", async (req, res) => {
	if (!req.body) return res.send("Server: 데이터가 비었습니다.");
	let Inputs: intentT = req.body;
	if (!Inputs.tag || !Inputs.patterns || !Inputs.responses) return res.send("Server: 데이터가 비었습니다.");
	console.log("AddChatBotData", req.headers.get('User-Agent'), req.headers.get('x-forwarded-for'));

    for (const field in Inputs) {
        if (Inputs[field] == '') {
            res.send(`Server: ${field} 값은 공백일 수 없습니다.`);
            return;
        }
        switch (field) {
            case "tag": {
				if(typeof Inputs[field] != "string") return res.send("Server: 데이터 타입이 올바르지 않습니다.");
				else break;
			}
            default: {
				if(typeof Inputs[field] != "object") {
					Inputs[field] = (Inputs[field] as string).split(",");
				}
				else break;
            }
        }
	}

	let found = false;
	intents.intents.forEach(async (intent, idx) => {
		if (intent.tag == Inputs.tag) {
			found = true;
			let intentUpdate = intents;
			
			intentUpdate.intents[idx].patterns = [...new Set(intentUpdate.intents[idx].patterns.concat(Inputs.patterns as string))];
			intentUpdate.intents[idx].responses = [...new Set(intentUpdate.intents[idx].responses.concat(Inputs.responses as string))];
			intentUpdate.intents[idx].context = [""];

			if(await WriteJSON(JSON.stringify(intentUpdate))) {
				res.send("Server: 업데이트 완료");
				return true;
			}
			else {
				res.send("Server: 데이터 작성 오류");
				return false;
			}
			
		}
		return false;
	});
	
	if (found) return;
	console.log("not found adding new one");

	let newIntent: intentT = {
		tag: Inputs.tag,
		patterns: Inputs.patterns,
		responses: Inputs.responses,
		context: [""]
	}

	intents.intents.push(newIntent);
	if(await WriteJSON(JSON.stringify(intents)))
		return res.send("Server: 추가 완료");
	else return res.send("Server: 데이터 작성 오류");
});

app.post("/ChatBotDataLabels", (req, res) => {
	let labels: Array<string> = [];

	for (const intent of intents.intents) {
		labels.push(intent.tag);
	}

	res.send(labels);
})

app.post("/ChatBotJSON", (req, res) => {
	if (req.body.pw == "ChatBotJSON") {
		console.log("JSONDownload", req.headers.get('User-Agent'), req.headers.get('x-forwarded-for'));
		res.download('./intents.json');
	} else {
		console.log("JSONDownload Rejected", req.headers.get('User-Agent'), req.headers.get('x-forwarded-for'));
		res.sendStatus(404).send("");
	}
})

const WriteJSON = (JSONData: string): Promise<boolean> => {
	return new Promise(async resolve => {
		try {
			await Deno.writeTextFile(PATH, JSONData);
			intents = JSON.parse(JSONData);
		} catch (err) {
			return resolve(false);
		} finally {
			return resolve(true);
		}
	})
}

app.listen(3333, async () => {
	let read = await Deno.readTextFile(PATH);
	intents = JSON.parse(read);
	console.log("Server Running: http://kkds.kr");
})
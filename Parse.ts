


(async () => {
	let res:any = {
		"intents": [
	   ]
	}
	let DataStructure = {
		tag: "",
		patterns: new Array(),
		responses: new Array(),
		context: [""]
	};

	console.log("Start");
	let Datas: string = await Deno.readTextFile("./datas.txt");
	console.log("Loaded");
	let DataArr: Array<string> = Datas.split("\r\n");
	console.log("Splited", DataArr.length);

	while (DataArr.length) {
		let Data: Array<string> = DataArr[0].split(",");
		if (Data.length > 3) {
			DataArr.shift();
			continue;
		}

		res.intents.push({
			tag: Data[0],
			patterns: [Data[0]],
			responses: [Data[1]],
			context: [""]
		})
		
		// R0.patterns.push(Data[0]);
		// R0.responses.push(Data[1]);
		DataArr.shift()
	}



	Deno.writeTextFile('./result.json', JSON.stringify(res));
})();

export type {};
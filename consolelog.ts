let logpath: string;

function LogFileName(): string {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}.${now.getMinutes()}.${now.getSeconds()}`;
}


function replaceAll(originstr: string, findstr: string, replacestr: string): string {
    return originstr.split(findstr).join(replacestr);
}

function sleep(t: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, t*1000);
    })
}

export async function init(name: string) {
    try {
        Deno.readDirSync('./logs');
    } catch(err) {
        await Deno.mkdir('./logs');
    } finally {
        logpath = `./logs/${LogFileName()} ${name}.txt`;
        await Deno.writeTextFile(logpath, "Log Started\n");

        let oldlog = console.log;
        console.log = (...data: any[]) => {
            let r = "";
            for (let string of data) {
                switch (typeof string) {
                    case "object":
                        string = replaceAll(JSON.stringify(string), `"`, " ");
                        break;
                }
                r += string + " ";
            }

            Deno.writeTextFile(logpath, r+"\n", {append: true});
            oldlog(r);
        }
    }
}

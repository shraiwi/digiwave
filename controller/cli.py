import asyncio, websockets, sys, json

PASSWORD = "this is an awful password!";

async def ainput(string: str) -> str:
    await asyncio.get_event_loop().run_in_executor(
        None, lambda s=string: sys.stdout.write(s+"\n"))
    return await asyncio.get_event_loop().run_in_executor(
        None, sys.stdin.readline)

async def main():
    async with websockets.connect(sys.argv[1]) as ws:
        await ws.send(json.dumps({
            "type": "promote",
            "password": PASSWORD,
        }))
        
        while True:
            cmd = (await ainput("please enter a command:")).strip()
            if cmd == "": break
            await ws.send(json.dumps({
               "type": "set_command",
               "command": cmd.strip(),
            }))

asyncio.run(main())

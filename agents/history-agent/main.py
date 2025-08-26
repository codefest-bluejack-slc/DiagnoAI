import requests
import json
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    StartSessionContent,
)
from uagents import Agent, Context, Protocol
from datetime import datetime, timezone, timedelta
from uuid import uuid4
from config import ConfigLoader
from dotenv import load_dotenv

load_dotenv()

ASI1_API_KEY = ConfigLoader.get_str("ASI1_API_KEY")
ASI1_BASE_URL = ConfigLoader.get_str("ASI1_BASE_URL")
ASI1_HEADERS = {
    "Authorization": f"Bearer {ASI1_API_KEY}",
    "Content-Type": "application/json"
}

HISTORY_CANISTER_ID = ConfigLoader.get_str("HISTORY_CANISTER_ID")
USER_CANISTER_ID = ConfigLoader.get_str("USER_CANISTER_ID")
BASE_URL = ConfigLoader.get_str("BASE_URL")

HEADERS = {
    "Host": f"{HISTORY_CANISTER_ID}.localhost",
    "Content-Type": "application/json"
}

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_history",
            "description": "Get My History",
            "parameters": {
                "type": "object",
                "properties": {
                    "username": {
                        "type": "string",
                        "description": "The username to check."
                    }
                },
                "required": ["username"],
                "additionalProperties": False
            },
            "strict": True
        }
    } 
]

async def call_backend_endpoint(func_name: str, args: dict):
    if func_name == "get_history":
        url = f"{BASE_URL}/get-history"
        response = requests.post(
            url,
            headers=HEADERS,
            json={
                "username": args["username"],
                "user_canister_id": USER_CANISTER_ID
            }
        )
        print("Raw response:", response.text)

        try:
            return response.json()
        except ValueError:
            import re, json
            clean_text = re.sub(r'[\x00-\x1f\x7f]', '', response.text)
            return json.loads(clean_text)

    else:
        raise ValueError(f"Unsupported function call: {func_name}")

async def process_query(query: str, ctx: Context) -> str:
    try:
        initial_message = {
            "role": "user",
            "content": query
        }
        payload = {
            "model": "asi1-mini",
            "messages": [initial_message],
            "tools": tools,
            "temperature": 0.7,
            "max_tokens": 1024
        }
        response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=payload
        )
        response.raise_for_status()
        response_json = response.json()
        print(response_json)

        tool_calls = response_json["choices"][0]["message"].get("tool_calls", [])
        messages_history = [initial_message, response_json["choices"][0]["message"]]

        if not tool_calls:
            content = response_json["choices"][0]["message"]["content"]
            if content:
                return content
            return "I couldn't determine what History information you're looking for. Please try rephrasing your question."

        for tool_call in tool_calls:
            func_name = tool_call["function"]["name"]
            arguments = json.loads(tool_call["function"]["arguments"])
            tool_call_id = tool_call["id"]

            ctx.logger.info(f"Executing {func_name} with arguments: {arguments}")

            try:
                result = await call_backend_endpoint(func_name, arguments)
                print("halo")
                print(result)
                content_to_send = json.dumps(result, ensure_ascii=False)
            except Exception as e:
                error_content = {
                    "error": f"Tool execution failed: {str(e)}",
                    "status": "failed"
                }
                print("error woe anjengk")
                print(e)
                content_to_send = json.dumps(error_content, ensure_ascii=False)

            tool_result_message = {
                "role": "tool",
                "tool_call_id": tool_call_id,
                "content": content_to_send
            }
            messages_history.append(tool_result_message)

        final_payload = {
            "model": "asi1-mini",
            "messages": messages_history,
            "temperature": 0.7,
            "max_tokens": 1024
        }
        final_response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=final_payload
        )
        final_response.raise_for_status()
        final_response_json = final_response.json()

        return final_response_json["choices"][0]["message"]["content"]

    except Exception as e:
        ctx.logger.error(f"Error processing query: {str(e)}")
        return f"An error occurred while processing your request: {str(e)}"

agent = Agent(
    name="History Agent",
    port=8004,
    mailbox=True,
    publish_agent_details=True,
    readme_path='./README.md'
)
chat_proto = Protocol(spec=chat_protocol_spec)

@chat_proto.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    try:
        ack = ChatAcknowledgement(
            timestamp=datetime.now(timezone.utc),
            acknowledged_msg_id=msg.msg_id
        )
        await ctx.send(sender, ack)

        for item in msg.content:
            if isinstance(item, StartSessionContent):
                ctx.logger.info(f"Got a start session message from {sender}")
                continue
            elif isinstance(item, TextContent):
                ctx.logger.info(f"Got a message from {sender}: {item.text}")
                response_text = await process_query(item.text, ctx)
                ctx.logger.info(f"Response text: {response_text}")
                response = ChatMessage(
                    timestamp=datetime.now(timezone.utc),
                    msg_id=uuid4(),
                    content=[TextContent(type="text", text=response_text)]
                )
                await ctx.send(sender, response)
            else:
                ctx.logger.info(f"Got unexpected content from {sender}")
    except Exception as e:
        ctx.logger.error(f"Error handling chat message: {str(e)}")
        error_response = ChatMessage(
            timestamp=datetime.now(timezone.utc),
            msg_id=uuid4(),
            content=[TextContent(type="text", text=f"An error occurred: {str(e)}")]
        )
        await ctx.send(sender, error_response)

@chat_proto.on_message(model=ChatAcknowledgement)
async def handle_chat_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Received acknowledgement from {sender} for message {msg.acknowledged_msg_id}")
    if msg.metadata:
        ctx.logger.info(f"Metadata: {msg.metadata}")

agent.include(chat_proto)

if __name__ == "__main__":
    agent.run()
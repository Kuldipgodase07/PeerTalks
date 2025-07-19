"use client"

import axios from "axios";
import { useEffect, useRef, useState } from "react"

export default function ChatBox({ chatid }) {
    const [messages, setMessages] = useState([]);
    const chatbox = useRef();
    useEffect(() => {
        axios
            .get(`/chat/api/messages?chatid=${chatid}&sender=${localStorage.getItem("username")}`)
            .then(function (response) {
                if (!response.data.error){
                    setMessages(response.data.messages);
                    if(chatbox.current){
                        chatbox.current.scrollTo(0,10000);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
            
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        const message = event.target.textbox.value;
        const username = localStorage.getItem("username")
        axios
            .post(`/chat/api/messages`, { message: message, chatid: chatid, sender: username })
            .then(function (response) {
                if (response.error) {
                    console.log(response)
                }
                else {
                    setMessages([...messages, response.data]);
                }

            })
            .catch(function (error) {
                console.log(error);
            });

        event.target.textbox.value = '';

    }
    return (
        <>
            <div
                className="relative flex flex-col justify-end bg-primary-50 text-[0.93rem] w-full pb-3 h-[80vh] flex-grow"
                style={{
                    background: `url("/image/chatbg.jpg")`,
                    backgroundColor: "hsl(278 100% 95%)",
                    backgroundSize: "50%",
                    backgroundBlendMode: "screen"
                }}
            >
                <div className="w-full px-6 overflow-y-scroll" ref = {chatbox} >
                    <ul className="flex flex-col pt-3">
                        {messages.map((elem, key, arr) => {
                            return (
                                <li key={key} className={`${arr[key - 1] && arr[key - 1].is_sender != elem.is_sender ? "mt-4" : "mt-0.5"} flex ${elem.is_sender ? "justify-end" : "justify-start"}`}>
                                    <div className={`relative max-w-xl px-4 py-2 ${elem.is_sender ? "bg-primary-600/90 text-white rounded-s-xl rounded-e-md" : "text-gray-700 bg-white/90 rounded-e-xl rounded-s-md"} shadow-chat`}>
                                        <span className="block">{elem.content}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <form onSubmit={sendMessage} className="flex items-center justify-between gap-x-4 w-full p-3 bg-white border-t border-gray-300">
                <input type="text" name="textbox" placeholder="Message" className="block w-full py-2 px-4 mx-2 bg-gray-100 transition-colors rounded-lg outline-none focus:text-gray-700" />
                <button type="submit">
                    <svg className="w-5 h-5 text-primary-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </form>
        </>
    )
}


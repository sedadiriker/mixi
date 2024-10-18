import React, { useEffect } from 'react';
import "./KonusanChatbot.css";  


const KonusanChatbot = ({ isVisible }) => {
    useEffect(() => {
        const host = "https://labs.heygen.com";
        const url = `${host}/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJjMjBmNGJkZGRiZTA0MWVjYmE5OGQ5MzQ0%0D%0ANGY4YjI5YiIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0AL2MyMGY0YmRkZGRiZTA0MWVjYmE5OGQ5MzQ0ZjhiMjliL2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0%0D%0ALndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjMy%0D%0AMWZlNjg1OGJkZTRmOGNiOGM1MTQ0NjAzNmNiNjg0IiwidXNlcm5hbWUiOiIxZmUwM2YzNjI2OGU0%0D%0AZGVhYjc3MTUxODBmYWQwMzIzMSJ9&inIFrame=1`;

        const wrapDiv = document.createElement("div");
        wrapDiv.id = "heygen-streaming-embed";
        wrapDiv.style.position = "absolute";

        wrapDiv.style.left = "5%";

        const container = document.createElement("div");
        container.id = "heygen-streaming-container";

        const iframe = document.createElement("iframe");
        iframe.allowFullscreen = false;
        iframe.title = "Streaming Embed";
        iframe.role = "dialog";
        iframe.allow = "microphone";
        iframe.src = url;

        let visible = false;
        let initial = false;

        window.addEventListener("message", (e) => {
            if (e.origin === host && e.data && e.data.type && e.data.type === "streaming-embed") {
                if (e.data.action === "init") {
                    initial = true;
                    wrapDiv.classList.toggle("show", initial);
                    if (initial) {

                        wrapDiv.style.top = isVisible ? "78%" : "55%"; // Adjust top based on isVisible
                    }
                } else if (e.data.action === "show") {
                    visible = true;
                    wrapDiv.classList.toggle("expand", visible);
                    if (visible) {
                        wrapDiv.style.top = "20%"; 
                        wrapDiv.style.left = "2%";

                    }
                } else if (e.data.action === "hide") {
                    visible = false;
                    wrapDiv.classList.toggle("expand", visible);
                    wrapDiv.style.top = "30%"; 
                }
            }
        });

        container.appendChild(iframe);
        wrapDiv.appendChild(container);
        document.body.appendChild(wrapDiv);


        // Set wrapDiv top position based on isVisible prop

        // Cleanup on component unmount
        return () => {
            document.body.removeChild(wrapDiv);
        };

    }, [isVisible]); // Include isVisible as a dependency

    return null;
};

export default KonusanChatbot;

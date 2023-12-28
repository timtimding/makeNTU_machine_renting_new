"use client"
import React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InputArea from "../ui/InputArea";

export default function Login() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const comfirmPasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [comfirmPassword, setComfirmPassword] = useState("");
    const [permission, setPermission] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const handleRegister = async () => {
        console.log(account, password, comfirmPassword);
        const username = account;
        if (account === "" || password === "" || comfirmPassword === "") {
            alert("帳號或密碼不得為空");
            return;
        }
        if (password !== comfirmPassword) {
            alert("密碼不一致");
            return;
        }

        try {
            // add sign up logic here
            const response = await fetch('api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, permission }),
            });
            if (!response.ok) {
                alert("登入失敗");
                console.log(response);
                return;
            }

            if (permission === 'contestant')  {
                router.push(`contestant/${username}`);
            } else if (permission === 'admin') {
                router.push(`admin/${username}`);
            } else {
                alert("找不到權限");
                return;
            }
        } catch (error) {
            alert("發生錯誤");
            console.log(error);
            return;
        }
    }

    const handleLogin = async () => {
        console.log(account, password);
        const username = account;
        if (account === "" || password === "") {
            alert("帳號或密碼不得為空");
            return;
        }
        if (username.startsWith("admin")) {
            setPermission("admin");
        } else if (username.startsWith("team")) {
            setPermission("contestant");
        } else {
            alert("帳號格式錯誤");
            return;
        }
        
        try {
            // add login logic here
            const response = await fetch('api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                alert("登入失敗");
                console.log(response);
                return;
            }

            if (permission === 'contestant')  {
                router.push(`contestant/${username}`);
            } else if (permission === 'admin') {
                router.push(`admin/${username}`);
            } else {
                alert("找不到權限");
                return;
            }
        } catch (error) {
            alert("發生錯誤");
            console.log(error);
            return;
        }
    }

    return (
        <>
        <div className="m-2 flex flex-col items-center justify-between border-2 border-black">
            <div className="m-2 flex items-center gap-2 border-2 border-black active:none">
                <p className="font-bold">帳號：</p>
                <InputArea
                    ref={usernameRef}
                    editable={true}
                    value={account}
                    placeHolder={"Team account"}
                    onChange={(e) => setAccount(e)}
                />
            </div>
            <div className="m-2 flex items-center gap-2 border-2 border-black">
                <p className="font-bold">密碼：</p>
                <InputArea
                    ref={passwordRef}
                    value={password}
                    editable={true}
                    type={"password"}
                    placeHolder={"Enter Password"}
                    onChange={(e) => setPassword(e)}
                />
            </div>
            {isSignUp && <div className="m-2 flex items-center gap-2 border-2 border-black">
                <p className="font-bold">確認密碼：</p>
                <InputArea
                    ref={comfirmPasswordRef}
                    value={comfirmPassword}
                    editable={true}
                    type={"password"}
                    placeHolder={"Comfirm Password"}
                    onChange={(e) => setComfirmPassword(e)}
                />
            </div>}
            {!isSignUp && <div className="m-2 flex items-center justify-center gap-2 border-2 border-black">
                <a className="m-1 text-xs font-bold underline hover:text-blue-800" onClick={() => setIsSignUp(true)}>
                    <p>—第一次登入？註冊—</p>
                </a>
            </div>}
            <div className="m-2 flex gap-2 border-2 border-black">
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={() => router.push("/")}
                >取消</button>
                {!isSignUp && <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={handleLogin}
                >登入</button>}
                {isSignUp && <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleRegister}
                >註冊</button>}
            </div>
        </div>
        </>
    )
}
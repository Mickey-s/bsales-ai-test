"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const API_KEY = "AIzaSyAXZYqr1Gefti4PKLtX0lPvf8pQa7rT7sY";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [result, setResult] = useState<{
    name: string | null;
    address: string | null;
    hours: string | null;
    googleMapLink: string | null;
  } | null>();

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    if (!content) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    const question = `Find restaurant name, address, open hours and google map link from the content below and return the result in json format that has name, address, hours and googleMapLink as a key
      `;

    try {
      const prompt = `
        ${question} 
        ${content}
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const json = JSON.parse(
        text.substring(text.indexOf("{"), text.indexOf("}") + 1)
      );
      setResult(json);
    } catch (e) {
      alert("Request Failed");
    } finally {
      setContent("");
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold underline text-center">
        Insert Post Content
      </h1>
      <textarea
        className="chat-input"
        onChange={(e) => handleChange(e.target.value)}
        value={content}
      />
      <div className="text-center pt-5">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-20 rounded"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Processing" : "Submit"}
        </button>
      </div>

      {result && (
        <>
          <hr className="mt-10" />

          <div className="mt-5 mb-10">
            <div>ชื่อร้าน: {result.name || "ไม่พบข้อมูล"}</div>
            <div className="mt-4">
              ที่อยู่: {result.address || "ไม่พบข้อมูล"}
            </div>
            <div className="mt-4">
              เวลาเปิด-ปิด: {result.hours || "ไม่พบข้อมูล"}
            </div>
            <div className="mt-4">
              Google map:{" "}
              {result.googleMapLink ? (
                <a href={result.googleMapLink} style={{ color: "green" }}>
                  {result.googleMapLink}
                </a>
              ) : (
                "ไม่พบข้อมูล"
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

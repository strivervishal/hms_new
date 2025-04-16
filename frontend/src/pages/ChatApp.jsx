// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const users = [
  {
    id: 1,
    name: "Dr. John Doe",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Dr. Emily Smith",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Dr. Sarah Brown",
    photo: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

const messages = {
  1: [
    { from: "Dr. John Doe", text: "Hello! How can I help you today?" },
    { from: "You", text: "I have a question about my health." },
    { from: "Dr. John Doe", text: "Sure, please describe your symptoms." },
    { from: "You", text: "I've been feeling fatigued lately." },
  ],
  2: [
    { from: "Dr. Emily Smith", text: "Good morning!" },
    { from: "You", text: "Hi Doctor!" },
    { from: "You", text: "I need some advice on my diet." },
    {
      from: "Dr. Emily Smith",
      text: "Of course! What are your current eating habits?",
    },
  ],
  3: [
    { from: "Dr. Sarah Brown", text: "How are you feeling today?" },
    { from: "You", text: "Much better, thanks!" },
    {
      from: "Dr. Sarah Brown",
      text: "That's great to hear. Are you taking your medications on time?",
    },
    { from: "You", text: "Yes, I am." },
  ],
};

export default function ChatApp() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const selectUser = (user) => {
    setSelectedUser(user);
    setChatMessages(messages[user.id] || []);
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setChatMessages([...chatMessages, { from: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[80vh] w-[80vw] bg-[#fafafa] text-dark mx-auto my-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-[#f7fafa] p-4 border-r border-blue-300">
        <h2 className="text-xl font-bold mb-4 text-black">Chats</h2>
        {users.map((user) => (
          <div
            key={user.id}
            className="p-3 bg-[#bafff4] hover:bg-[#74f7f3] rounded-lg mb-2 cursor-pointer flex items-center text-black"
            onClick={() => selectUser(user)}
          >
            <img
              src={user.photo}
              alt={user.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            {user.name}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-2/3 flex flex-col">
        {selectedUser ? (
          <div className="flex flex-col h-full">
            <div className="bg-[#bafff4] p-4 flex items-center border-b border-blue-400">
              <img
                src={selectedUser.photo}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full mr-3 "
              />
              <span className="text-xl font-bold text-black">
                {selectedUser.name}
              </span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg max-w-xs ${
                    msg.from === "You"
                      ? "bg-[#bafff4] text-black self-end"
                      : "bg-[#74f7f3] text-black self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-blue-300 flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="ml-2 px-4 py-2 bg-[#74f7f3] text-black rounded-lg"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
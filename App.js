import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Alert, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Send, Trash} from "react-native-feather";

export default function App() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {
            role: 'model',
            parts: {message: 'Senang bertemu denganmu. Silahkan tanya apa yang ingin kamu ketahui :)'}
        }
    ]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
    }, []);

    const reset = () => {
        setInput('')
        setChatHistory([
            {
                role: 'model',
                parts: {message: 'Senang bertemu denganmu. Silahkan tanya apa yang ingin kamu ketahui :)'}
            }
        ])
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            chatting();
        }
    };

    const chatting = async () => {
        if (input.trim() === "") {
            await Alert.alert('Error', 'Please enter a message before sending.')
            return;
        }

        setLoading(true)
        try {
            const options = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    user: "user",
                    message: input,
                }),
            };
            const response = await fetch("http://157.245.200.183:5000/gemini", options);
            const data = await response.json();

            setLoading(false)
            setChatHistory(oldChatHistory => [...oldChatHistory, {
                role: "user",
                parts: input,
            },
                {
                    role: "model",
                    parts: data,
                }
            ])
            setLoading(false)
            setInput('')
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <View className="flex-1 bg-gray-900">

            <View
                className="flex min-h-svh flex-col items-center mt-5 justify-between selection:text-blue-700 selection:bg-gray-900">
                <View className="position fixed mt-5 mb-4 w-full z-10">
                    <Text
                        className="text-2xl md:text-4xl font-semibold bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-400 text-center text-transparent px-4 py-1 rounded-full border w-fit mx-auto border-slate-500/60 backdrop-blur shadow-md text-white">
                        React Gemini ✨
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{paddingTop: 10, paddingBottom: 16, flexGrow: 1}}
                contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start'}}
                ref={messagesEndRef}
            >
                {chatHistory.map((item, index) => (
                    <View key={index} style={{alignItems: item.role === 'model' ? 'flex-start' : 'flex-end'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                marginLeft: 8,
                                marginRight: 8,
                                fontWeight: 'bold',
                                color: '#fff',
                                opacity: 0.8
                            }}>
                                {item.role === 'model' ? 'Gemini' : 'You'}
                            </Text>
                        </View>
                        <View
                            style={{
                                backgroundColor: item.role === 'model' ? '#9ca3af' : '#4a90e2',
                                padding: 10,
                                borderRadius: 10,
                                marginTop: 5,
                                maxWidth: '80%',
                                marginBottom: 20,
                                marginLeft: 8,
                                marginRight: 8
                            }}
                        >
                            <Text>{item.role === 'model' ? item.parts.message : item.parts}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 8,
                paddingVertical: 2,
                alignItems: 'center',
                backgroundColor: 'transparent'
            }}>
                <TouchableOpacity style={{padding: 10, marginBottom: 10}} onPress={reset}>
                    <Trash width={24} height={24} color="#e53e3e"/>
                </TouchableOpacity>
                <TextInput
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder="Start Chatting..."
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        marginBottom: 10,
                    }}
                    multiline={true}
                    numberOfLines={1}
                    blurOnSubmit={true}
                    onSubmitEditing={chatting}
                    onKeyPress={handleKeyDown}
                />
                <TouchableOpacity
                    style={{
                        padding: 10,
                        backgroundColor: loading ? '#9e9e9e' : '#3182ce',
                        borderRadius: 20,
                        marginLeft: 5,
                        marginBottom: 10
                    }}
                    onPress={chatting}
                    disabled={loading}
                >
                    {loading ? (
                        <View style={{width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="small" color="#ffffff"/>
                        </View>
                    ) : (
                        <Send width={24} height={24} color="#ffffff"/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

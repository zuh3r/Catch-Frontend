import React from 'react';
import ChannelList from '../Channel/ChannelList';
import './App.scss';
import MessagesPanel from '../Message/MessagesPanel';
import socketClient from "socket.io-client";


const SERVER = "http://127.0.0.1:4567";

class App extends React.Component {

    state = {
        channels: null,
        socket: null,
        channel: null,
        userName: ''
    }
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient(SERVER);
        socket.on('connection', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('channel', channel => {
            
            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({ channels });
        });
        socket.on('message', message => {
            
            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id === message.channel_id) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({ channels });
        });
        this.socket = socket;
    }

    loadChannels = async () => {
        fetch('http://localhost:4567/getChannels', {
            withCredentials: false
        }).then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }

    handleChannelSelect = id => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });
        this.setState({ channel });
        this.socket.emit('channel-join', id, ack => {
        });
    }

    handleSendMessage = (channel_id, text) => {
        if (this.state.userName !== '') {
            this.socket.emit('send-message', { channel_id, text, senderName: this.state.userName, id: Date.now() });
        }   
    }

    updateUserName = (name) => {
        this.setState({ userName: name.target.value })
    }

    render() {

        return (
            <div className="App">
                <div className="header">
                    <h1>CATCH</h1>
                    <p>Username: <input onChange={this.updateUserName} type="text" value={this.state.userName} /></p>
                </div>
                <div className='chat-app'>
                    <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                    
                    <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
                    
                </div>
            </div>
        );
    }
}

export default App;
import React, { useState } from 'react';

const App = () => {

    const [isConnected, setIsConnected] = useState(false);
    csont [file, setFile] = useState(null);
    

    const handleConnection = () => {
        console.log('Sending offer to peer');

        // handle connection logic here

        setIsConnected(true);
    };

    const handleDisconnection = () => {

        // handle disconnection logic here

        setIsConnected(false);

    }

    const handleFileSelection = () => {

    }

    return (
        <div style={{
            padding: "2rem",
        }}>
            <h1>Send files peer to peer</h1>
            <button id="connectbutton" onClick={() => {
                if (isConnected) {
                    handleDisconnection();
                } else {
                    handleConnection();
                }
            }}>
                {isConnected ? "Disconnect" : "Connect with peer"}
            </button>

            {isConnected && (
                <div>
                    {/* button for choosing file, button for sending */}
                    <button
                        onClick={() => {
                            // handle file choosing logic here
                        }}
                    >Choose file</button>
                </div>
            
            )}
        </div>
    )
}

export default App;
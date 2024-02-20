package rmi.custchat;

// public class MessageServer {
    
// }

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;
import java.util.Map;

public class MessageServer extends UnicastRemoteObject implements MessageService {
    private Map<String, StringBuilder> messages;

    public MessageServer() throws RemoteException {
        super();
        messages = new HashMap<>();
    }

    @Override
    public synchronized void sendMessage(String sender, String receiver, String message) throws RemoteException {
        if (!messages.containsKey(receiver)) {
            messages.put(receiver, new StringBuilder());
        }
        StringBuilder receiverMessages = messages.get(receiver);
        receiverMessages.append(sender).append(": ").append(message).append("\n");
        System.out.println(sender + " sent a message to " + receiver);
    }

    @Override
    public synchronized String receiveMessage(String receiver) throws RemoteException {
        if (!messages.containsKey(receiver)) {
            return "No messages for " + receiver;
        }
        StringBuilder receiverMessages = messages.get(receiver);
        String received = receiverMessages.toString();
        receiverMessages.setLength(0); // Clear messages after reading
        return received;
    }

    public static void main(String[] args) {
        try {
            MessageServer server = new MessageServer();
            java.rmi.registry.LocateRegistry.createRegistry(1099);
            java.rmi.registry.Registry registry = java.rmi.registry.LocateRegistry.getRegistry();
            registry.rebind("MessageService", server);
            System.out.println("Server started");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

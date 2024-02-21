package rmi.custchat;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface MessageService extends Remote {
    void sendMessage(String sender, String receiver, String message) throws RemoteException;
    String receiveMessage(String receiver) throws RemoteException;
}

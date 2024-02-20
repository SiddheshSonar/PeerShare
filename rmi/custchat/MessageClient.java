package rmi.custchat;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class MessageClient {
    public static void main(String[] args) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);
            MessageService messageService = (MessageService) registry.lookup("MessageService");

            Scanner scanner = new Scanner(System.in);
            System.out.print("Enter your name: ");
            String name = scanner.nextLine();

            System.out.print("Enter receiver's name (or 'exit' to quit): ");
            String receiver = scanner.nextLine();
            if (receiver.equals("exit")) {
                System.out.println("Exiting...");
                return;
            }

            List<String> receivedMessages = new ArrayList<>();

            // Thread for continuously receiving messages
            new Thread(() -> {
                try {
                    while (true) {
                        String message = messageService.receiveMessage(name);

                        // receivedMessages.add(messageService.receiveMessage(name));
                        Thread.sleep(1000); // Adjust as needed for refresh rate
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();

            // Menu loop
            while (true) {
                System.out.println("\nMenu:");
                System.out.println("1. Send message");
                System.out.println("2. View messages");
                System.out.println("3. Exit");

                System.out.print("Choose an option: ");
                int option = scanner.nextInt();
                scanner.nextLine(); // Consume newline character

                switch (option) {
                    case 1:
                        System.out.print("Enter message: ");
                        String message = scanner.nextLine();
                        messageService.sendMessage(name, receiver, message);
                        break;
                    case 2:
                        if (!receivedMessages.isEmpty()) {
                            System.out.println("Received messages:");
                            int count = 1;
                            for (String msg : receivedMessages) {
                                System.out.println(count + ". " + msg);
                                count++;
                            }
                            receivedMessages.clear(); // Clear the list after viewing
                        } else {
                            System.out.println("No messages received.");
                        }
                        break;
                    case 3:
                        System.out.println("Exiting...");
                        return;
                    default:
                        System.out.println("Invalid option");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

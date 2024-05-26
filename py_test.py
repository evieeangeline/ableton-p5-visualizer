import socket

ip = '127.0.0.1'
port = 3812


def receive_messages(ip, port):
    # Create a socket object
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Connect the socket to the address given on the command line
    try:
        sock.connect((ip, port))
        print(f"Connected to {ip} on port {port}")

        while True:
            data = sock.recv(1024)  # Buffer size is 1024 bytes
            if not data:
                print("No more data received.")
                break
            print("Received:", data.decode())  # Assuming data is in UTF-8 format

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        sock.close()
        print("Socket closed.")

# Replace '192.168.1.1' and 12345 with the appropriate IP address and port
receive_messages(ip, port)

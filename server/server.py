import socket

HOST, PORT = '', 8888
listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
listen_socket.bind((HOST, PORT))
listen_socket.listen(1)
print 'Serving HTTP on port %s ...' % PORT

while True:
    client_connection, client_address = listen_socket.accept()
    request = client_connection.recv(1024)
    print request
    # TODO: check for the validity of the request
    # TODO: need to convert the user address into coordinate (latitude, longitude)
    # TODO: make function to retrieve data from bigquery
    response = """\
HTTP/1.1 200 OK

Hello from Team GupZonTic
"""
    client_connection.sendall(response)
    client_connection.close()

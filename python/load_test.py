import socket
import argparse


def split_addr(addr):
    host, port = addr.split(':')
    return (host, int(port))


def main():
    parser = argparse.ArgumentParser(description='Load test udp socket')
    parser.add_argument('target', help='Target address')
    parser.add_argument('--count', type=int, default=1000, help='Number of requests to send')
    parser.add_argument('--data', default='testing\n', help='Data string to use as payload')

    args = parser.parse_args()

    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    for i in range(args.count):
        s.sendto("{} - {}".format(i, args.data).encode('utf-8'), split_addr(args.target))

if __name__ == '__main__':
  main()

import socket
import argparse


def split_addr(addr):
	host, port = addr.split(':')
	return (host, int(port))

def main():
	parser = argparse.ArgumentParser(description='Proxy & repeat udp traffic from a host to N destinations')
	parser.add_argument('--host', type=str, default="127.0.0.1:8125", help='Host address & port e.g. 127.0.0.1:8125')
	parser.add_argument('destinations', metavar="dest", nargs='+', help='Destination addresses')

	args = parser.parse_args()

	print('listening on {}'.format(args.host))
	print('proxying to {}'.format(args.destinations))

	listen = split_addr(args.host)
	destinations = [split_addr(d) for d in args.destinations]

	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

	s.bind(listen)

	while True:
		data, _ = s.recvfrom(1024)
		for dest in destinations:
			s.sendto(data, dest)

if __name__ == '__main__':
	main()

#

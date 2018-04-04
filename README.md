# udp-tap
Proxy &amp; repeat UDP traffic from a host to N destinations


Usage:
```
Usage: listen [options] <destination> [otherDestinations...]

Options:

  -V, --version      output the version number
  -h, --host <host>  Host address & port (default: 0.0.0.0:8125)
  -v, --verbose      Enable verbose logging
  -h, --help         output usage information
```

e.g.
```sh
node listen.js --host 127.0.0.1:8125 127.0.0.1:9999 127.0.0.1:9998

# listening on 127.0.0.1:8125
# proxying to ['127.0.0.1:9999', '127.0.0.1:9998']
```

# udp-tap
Proxy &amp; repeat UDP traffic from a host to N destinations


Usage:
```
usage: listen.py [-h] [--host HOST] dest [dest ...]
```

e.g.
```sh
python3 listen.py --host 127.0.0.1:8125 127.0.0.1:9999 127.0.0.1:9998

# listening on 127.0.0.1:8125
# proxying to ['127.0.0.1:9999', '127.0.0.1:9998']
```

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const dns = require('dns');
const url = require('url');
const program = require('commander');
const pkg = require('./package.json');


program
  .version(pkg.version)
  .usage('[options] <destination> [otherDestinations...]')
  .option('-h, --host <host>', 'Host address & port', '0.0.0.0:8125')
  .option('-v, --verbose', 'Enable verbose logging')
  .parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
  process.exit(1);
}

const getAddress = (addr) => {
  const [host, port = 8125] = addr.replace('udp://', '').split(':');
  if (program.verbose) console.log('getting', host, port);

  return new Promise((resolve, reject) => {
    dns.lookup(host, (err, name, family) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(name);
      }
    });
  }).then(name => {
    return { orig_host: host, host: name, port };
  }).catch(err => {
    console.error(`cannot resolve ${addr}`, err);
  });
};

const getDestinations = () => {
  return Promise.all(program.args.map(getAddress));
};

function shutdown(signal) {
  console.log(`Received ${signal}`);
  server.close();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

Promise.all([getAddress(program.host), getDestinations()]).then(values => {
  const [host, destinations] = values;

  server.bind(host.port, host.host);
  const displayDestinations = destinations.map(d => `${d.host}:${d.port}`);
  console.log(`proxying to ${displayDestinations}`);

  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    destinations.forEach(dest => {
      server.send(msg, dest.port, dest.host, (err) => {
        if (program.verbose && err) console.error(`error sending to ${dest.host}:${dest.port}`, err);
        if (program.verbose) console.log(msg.toString(), `-> ${dest.host}:${dest.port}`);
      });
    })
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`listening on ${address.address}:${address.port}`);
  });
});

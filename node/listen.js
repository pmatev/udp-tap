const dgram = require('dgram');
const server = dgram.createSocket('udp4');
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

const splitAddress = (addr) => {
  const split = addr.split(':');
  return {
    host: split[0],
    port: split[1]
  };
};

const destinations = program.args.map(splitAddress);

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
  console.log(`proxying to ${program.args}`);
});

const host = splitAddress(program.host)
server.bind(host.port, host.host);

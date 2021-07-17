import arg from 'arg'
import {start} from './fakeServer'
import {info, push, map} from './deployer'
export function argsToOptions(rawArgs) {
  const args = arg({
    '--deploy': String,
    '-d': '--deploy',
    '--artifact_id': String,
    '--version': String,
    '--emulate': String,
    '-e': '--emulate',
    '--port': Number,
    '-p': '--port',
    '--secret': String,
    '--public': String,
    '--artifact': String,
    '--file': String,
    '--url': String

  }, {
    argv: rawArgs.slice(2)
  })
  return {
    version: args['--deploy'],
    emulate: args['--emulate'],
    artifact_id: args['--artifact_id'],
    version: args['--version'],
    port: args['--port'],
    deploy: args['--deploy'],
    secret: args['--secret'],
    artifactName: args['--artifact'],
    mainFileName: args['--file'],
    url: args['--url'],
    public: args['--public']
  }
}

export function cli(args) {
  const command = args.slice(2)

  const options = argsToOptions(args)
  if (command[0] === 'info') {
    try {
      info(options)
    } catch (ex) {
      console.log(ex.message)
    }
  }
  if (command[0] === 'push') {
    try {
      push(options)
    } catch (ex) {
      console.log(ex.message)
    }
  }
  if (command[0] === 'map') {
    try {
      map(options)
    } catch (ex) {
      console.log(ex.message)
    }
  }
  if (options.emulate) {
    try {
      start(options)
    } catch (ex) {
      console.log(ex.message)
    }
  }

}
var path = require('path');
var _root = path.resolve(__dirname, '../..');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

function packageSort(packages) {
  // packages = ['polyfills', 'vendor', 'app']
  var len = packages.length - 1;
  var first = packages[0];
  var last = packages[len];
  return function sort(a, b) {
    // polyfills always first
    if (a.names[0] === first) {
      return -1;
    }
    // app always last
    if (a.names[0] === last) {
      return 1;
    }
    // vendor before app
    if (a.names[0] !== first && b.names[0] === last) {
      return -1;
    } else {
      return 1;
    }
    // a must be equal to b
    return 0;
  }
}

function getENVbyEvent(npmLifecycleEvent) {
    var env = 'dev';
    switch (npmLifecycleEvent) {
        case 'dist:prod':
            env = 'prod';
            break;
        case 'dist:stag':
            env = 'stag';
            break;
        case 'test:w':
            env = 'test';
            break;
        default:
            env = 'dev';
    }

    return env;
}

exports.root = root;
exports.packageSort = packageSort;
exports.getENVbyEvent = getENVbyEvent;
